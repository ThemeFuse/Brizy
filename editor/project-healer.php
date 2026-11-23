<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * Self healing for the global project record. See BRZ-693.
 *
 * The project is a singleton stored in the `brizy-project` post meta of a
 * `brizy-project` post. When that meta row disappears, or when it survives but
 * loses its `data` key, every single write to the project is refused by
 * Brizy_Editor_Storage_Project::loadStorage() and the whole plugin becomes
 * unusable: the license cannot be activated, the cloud cannot be connected, the
 * compiler cannot store styles and imports fail.
 *
 * This class repairs that state in place, at the moment the project is loaded,
 * without asking anybody to press anything.
 *
 * Design rules, in order of importance:
 *
 *  1. Never destroy data. Everything the site owner configured (license, cloud
 *     credentials, forms, accounts, image optimizer settings) is preserved and
 *     only the genuinely absent keys are refilled. The previous meta value is
 *     copied to a backup meta row before anything is written.
 *  2. Never mask a broken database. If the posts/postmeta tables cannot be read,
 *     or the project post row is not there, the repair declines and shouts in
 *     the log instead of writing defaults over an unknown state.
 *  3. Never loop. A cross request lock, a cooldown and a hard attempt cap make
 *     the repair effectively a one shot operation per broken state; on a healthy
 *     site not a single extra query is executed.
 */
class Brizy_Editor_ProjectHealer {

	/**
	 * Post meta key holding the verbatim copy of the value we are about to
	 * overwrite. Rows are appended, never replaced.
	 */
	const BACKUP_META_KEY = 'brizy-project-backup';

	/**
	 * Option holding the report of the last successful repair, so that
	 * Brizy_Admin_ProjectHealedNotice can tell the site owner what happened.
	 * A repair that nobody is told about is indistinguishable from data loss.
	 */
	const NOTICE_OPTION = 'brizy_project_healed_notice';

	/**
	 * Per project bookkeeping option: attempts, last attempt, "gave up" flag.
	 */
	const STATE_OPTION_PREFIX = 'brizy_project_heal_';

	/**
	 * Per project mutex option. Written with raw SQL so that it works across
	 * processes regardless of the object cache.
	 */
	const LOCK_OPTION_PREFIX = 'brizy_project_heal_lock_';

	/**
	 * Seconds after which a lock left behind by a fatal error is considered dead.
	 */
	const LOCK_TTL = 60;

	/**
	 * Seconds between two repair attempts for the same project.
	 */
	const RETRY_COOLDOWN = 300;

	/**
	 * How many times we are willing to try before giving up for good.
	 */
	const MAX_ATTEMPTS = 5;

	const STATE_HEALTHY    = 'healthy';
	const STATE_MISSING    = 'missing';
	const STATE_EMPTY_DATA = 'empty-data';

	/**
	 * Keys that belong to the site owner and can never be regenerated from the
	 * editor defaults. They are listed here only so that the log can report what
	 * survived the repair; the merge itself never overwrites a non empty value.
	 *
	 * @var array
	 */
	private static $preservedKeys = array(
		'brizy-license-key',
		'brizy-cloud-token',
		'brizy-cloud-account-id',
		'brizy-cloud-project',
		'cloudContainer',
		'forms',
		'image-optimizer-settings',
		'accounts',
		'signature',
	);

	/**
	 * The one and only definition of "this project can be saved".
	 *
	 * Kept deliberately equivalent to the original guard in
	 * Brizy_Editor_Storage_Project::loadStorage() so that the healer and the
	 * validator can never disagree about what a broken project looks like.
	 *
	 * @param mixed $value
	 *
	 * @return bool
	 */
	public static function isHealthy( $value ) {
		return self::detectState( $value ) === self::STATE_HEALTHY;
	}

	/**
	 * @param mixed $value
	 *
	 * @return string one of the STATE_* constants
	 */
	public static function detectState( $value ) {

		if ( ! is_array( $value ) || count( $value ) === 0 ) {
			return self::STATE_MISSING;
		}

		if ( ! isset( $value['data'] ) || is_null( $value['data'] ) || empty( $value['data'] ) ) {
			return self::STATE_EMPTY_DATA;
		}

		return self::STATE_HEALTHY;
	}

	/**
	 * Redacted diagnostics for the log.
	 *
	 * Only key names, sizes and booleans. The project record carries the license
	 * key and the cloud token, so the value itself must never reach the log table.
	 *
	 * @param int $postId
	 * @param mixed $value
	 *
	 * @return array
	 */
	public static function describe( $postId, $value ) {

		$state = self::readState( $postId );

		$dataLength = 0;
		if ( is_array( $value ) && isset( $value['data'] ) && is_string( $value['data'] ) ) {
			$dataLength = strlen( $value['data'] );
		}

		return array(
			'post_id'           => (int) $postId,
			'state'             => self::detectState( $value ),
			'value_type'        => is_array( $value ) ? 'array' : gettype( $value ),
			'keys'              => is_array( $value ) ? array_keys( $value ) : array(),
			'data_length'       => $dataLength,
			'heal_attempts'     => isset( $state['attempts'] ) ? (int) $state['attempts'] : 0,
			'heal_last_attempt' => isset( $state['last'] ) ? gmdate( 'Y-m-d H:i:s', (int) $state['last'] ) : null,
		);
	}

	/**
	 * Repair the project record of the given post, if it needs it and if it is
	 * safe to do so.
	 *
	 * Never throws: a load path must not become a new source of fatal errors.
	 * When the repair is declined or fails, the value it was given is returned
	 * unchanged and the behaviour of the plugin is exactly what it is today.
	 *
	 * @param int $postId
	 * @param mixed $value the value just read from the storage
	 *
	 * @return array|mixed
	 */
	public static function heal( $postId, $value ) {

		if ( self::isHealthy( $value ) ) {
			return $value;
		}

		$postId = (int) $postId;
		$post   = $postId ? get_post( $postId ) : null;

		if ( ! self::isHealingAllowed( $post ) ) {
			return $value;
		}

		if ( ! self::isStorageReadable( $postId ) ) {
			Brizy_Logger::instance()->critical(
				'The project data is invalid but the database cannot be read. The automatic repair was skipped on purpose.',
				self::describe( $postId, $value )
			);

			return $value;
		}

		if ( ! self::shouldAttempt( $postId, $value ) ) {
			return $value;
		}

		if ( ! self::acquireLock( $postId ) ) {
			// Another request is repairing the very same project right now.
			return $value;
		}

		$healed = $value;

		try {
			$healed = self::repair( $postId, $value );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical(
				'The automatic repair of the project data failed: ' . $e->getMessage(),
				self::describe( $postId, $value )
			);
		}

		self::releaseLock( $postId );

		return $healed;
	}

	/**
	 * Manual repair: the Tools page and WP-CLI enter here.
	 *
	 * Same repair as the automatic one, with the rate limiting lifted. The
	 * cooldown and the attempt cap exist to keep unattended page loads from
	 * hammering a database that will not accept the write; when a human asks for
	 * the repair explicitly there is nothing to protect against.
	 *
	 * @param int $postId
	 *
	 * @return array {repaired: bool, state: string}
	 */
	public static function forceHeal( $postId ) {

		$postId = (int) $postId;

		self::clearState( $postId );
		wp_cache_delete( $postId, 'post_meta' );

		$value = Brizy_Editor_Storage_Project::instance( $postId )->get_storage();

		if ( self::isHealthy( $value ) ) {
			return array( 'repaired' => false, 'state' => self::STATE_HEALTHY );
		}

		$state  = self::detectState( $value );
		$healed = self::heal( $postId, $value );

		// The project singleton was built from the broken value; drop it so the
		// rest of the request sees what is now in the database.
		Brizy_Editor_Project::cleanClassCache();

		return array( 'repaired' => self::isHealthy( $healed ), 'state' => $state );
	}

	/**
	 * `wp brizy repair-project`
	 *
	 * The way to rescue a site whose dashboard is not reachable.
	 *
	 * @internal
	 */
	public static function cli() {

		try {
			$result = self::forceHeal( Brizy_Editor_Project::get()->getWpPostId() );
		} catch ( Exception $e ) {
			WP_CLI::error( $e->getMessage() );

			return;
		}

		if ( $result['state'] === self::STATE_HEALTHY ) {
			WP_CLI::success( 'The project data is valid. Nothing had to be repaired.' );
		} elseif ( $result['repaired'] ) {
			WP_CLI::success( 'The project data was repaired. The previous value was kept in the ' . self::BACKUP_META_KEY . ' post meta.' );
		} else {
			WP_CLI::error( 'The project data could not be repaired. The reason was written to the Brizy log.' );
		}
	}

	/**
	 * The repair itself. Runs under the lock.
	 *
	 * @param int $postId
	 * @param mixed $value
	 *
	 * @return array
	 * @throws Exception
	 */
	private static function repair( $postId, $value ) {

		// Re-read with a cold meta cache. Between the moment the caller read the
		// storage and the moment we won the lock another request, or
		// Brizy_Editor_Project::createPost(), may have written a perfectly valid
		// project. Repairing it would then be pure data loss.
		wp_cache_delete( $postId, 'post_meta' );

		$storage = Brizy_Editor_Storage_Project::instance( $postId );
		$current = $storage->get_storage();

		if ( self::isHealthy( $current ) ) {
			self::clearState( $postId );

			return $current;
		}

		$state       = self::detectState( $current );
		$description = self::describe( $postId, $current );

		// The attempt is burned here, before anything below can fail. A repair
		// that dies half way through - unusable defaults.json, a fatal error in
		// the middle of the write - must not be retried on the very next request.
		self::recordAttempt( $postId );

		// Throws when defaults.json is missing, empty or not valid json. Better a
		// logged failure than a project seeded from a truncated build artifact.
		$defaults = Brizy_Editor_Project::defaultProjectData();

		$report = array();
		$healed = self::buildHealedValue( $current, $defaults, $report );

		if ( ! self::isHealthy( $healed ) ) {
			throw new Exception( 'The repaired project data is still invalid.' );
		}

		// The repair is only allowed to be irreversible when there was nothing to
		// lose in the first place. If a value exists but its copy cannot be
		// stored, the live row is left exactly as it is.
		if ( ! self::backup( $postId, $state ) ) {
			throw new Exception( 'The previous project data could not be backed up, so it was not overwritten.' );
		}

		$storage->loadStorage( $healed );

		wp_cache_delete( $postId, 'post_meta' );
		$verified = $storage->get_storage();

		if ( ! self::isHealthy( $verified ) ) {
			throw new Exception( 'The repaired project data could not be written to the database.' );
		}

		self::clearState( $postId );

		update_option( self::NOTICE_OPTION, array(
			'post_id'         => (int) $postId,
			'state'           => $state,
			'repaired_at'     => current_time( 'mysql', 1 ),
			'restored'        => $report['restored'],
			'preserved'       => $report['preserved'],
			'backup_meta_key' => self::BACKUP_META_KEY,
		), false );

		Brizy_Logger::instance()->critical(
			'The project data was invalid and has been repaired automatically from the editor defaults.',
			array_merge( $description, array(
				'restored_keys'   => $report['restored'],
				'preserved_keys'  => $report['preserved'],
				'backup_meta_key' => self::BACKUP_META_KEY,
			) )
		);

		return $verified;
	}

	/**
	 * Surgical merge: fill the holes, touch nothing else.
	 *
	 * Keys that are not part of the defaults (compiledStyles, compiler, anything
	 * a future version adds) are carried over untouched.
	 *
	 * @param mixed $current
	 * @param array $defaults
	 * @param array $report
	 *
	 * @return array
	 */
	private static function buildHealedValue( $current, $defaults, &$report ) {

		$healed = is_array( $current ) ? $current : array();
		$report = array( 'restored' => array(), 'preserved' => array() );

		foreach ( $defaults as $key => $default ) {

			$meaningful = self::hasMeaningfulValue( $healed, $key );

			if ( $key === 'data' ) {
				// `data` uses the exact emptiness test the save validator uses.
				$meaningful = $meaningful && ! empty( $healed['data'] );
			}

			if ( $meaningful ) {
				if ( in_array( $key, self::$preservedKeys, true ) ) {
					$report['preserved'][] = $key;
				}
				continue;
			}

			$before         = array_key_exists( $key, $healed ) ? $healed[ $key ] : null;
			$healed[ $key ] = $default;

			if ( $before !== $default ) {
				$report['restored'][] = $key;
			}
		}

		return $healed;
	}

	/**
	 * @param array $value
	 * @param string $key
	 *
	 * @return bool
	 */
	private static function hasMeaningfulValue( $value, $key ) {

		if ( ! is_array( $value ) || ! array_key_exists( $key, $value ) ) {
			return false;
		}

		$current = $value[ $key ];

		if ( is_array( $current ) ) {
			return count( $current ) > 0;
		}

		if ( is_object( $current ) ) {
			return true;
		}

		if ( is_string( $current ) ) {
			return trim( $current ) !== '';
		}

		return ! empty( $current );
	}

	/**
	 * Contexts in which repairing would be wrong rather than merely useless.
	 *
	 * @param mixed $post
	 *
	 * @return bool
	 */
	private static function isHealingAllowed( $post ) {

		if ( ! $post instanceof WP_Post ) {
			return false;
		}

		// Revisions and autosaves are created empty on purpose by
		// Brizy_Editor_AutoSaveAware::auto_save_post() and are loaded through the
		// very same constructor. Seeding defaults into them would be nonsense.
		if ( $post->post_type !== Brizy_Editor_Project::BRIZY_PROJECT ) {
			return false;
		}

		if ( (int) $post->post_parent !== 0 ) {
			return false;
		}

		// The plugin is being removed: writing anything back is pointless and
		// would resurrect rows the uninstaller is deleting.
		if ( defined( 'WP_UNINSTALL_PLUGIN' ) ) {
			return false;
		}

		// WordPress is installing itself, upgrading its own schema or repairing
		// the database. Reads are not trustworthy and writes may be rolled back.
		if ( function_exists( 'wp_installing' ) ) {
			if ( wp_installing() ) {
				return false;
			}
		} elseif ( defined( 'WP_INSTALLING' ) && WP_INSTALLING ) {
			return false;
		}

		if ( defined( 'WP_SETUP_CONFIG' ) ) {
			return false;
		}

		if ( defined( 'WP_REPAIRING' ) && WP_REPAIRING ) {
			return false;
		}

		// Escape hatches for hosts that insist on a strictly read only front end.
		if ( defined( 'BRIZY_DISABLE_PROJECT_AUTO_HEAL' ) && BRIZY_DISABLE_PROJECT_AUTO_HEAL ) {
			return false;
		}

		return (bool) apply_filters( 'brizy_project_auto_heal_enabled', true, $post );
	}

	/**
	 * Tell "the project row lost its data" apart from "the database is on fire".
	 *
	 * Writing the editor defaults over a site whose postmeta table is simply
	 * unreadable would turn a recoverable outage into real data loss, so both the
	 * posts and the postmeta table have to answer before anything is repaired.
	 *
	 * @param int $postId
	 *
	 * @return bool
	 */
	private static function isStorageReadable( $postId ) {

		global $wpdb;

		if ( ! isset( $wpdb ) || ! is_object( $wpdb ) ) {
			return false;
		}

		$suppress = $wpdb->suppress_errors( true );

		$postExists = $wpdb->get_var( $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} WHERE ID = %d LIMIT 1", $postId ) );
		$postsError = $wpdb->last_error;

		$wpdb->get_var( $wpdb->prepare( "SELECT COUNT(1) FROM {$wpdb->postmeta} WHERE post_id = %d", $postId ) );
		$metaError = $wpdb->last_error;

		$wpdb->suppress_errors( $suppress );

		if ( ! empty( $postsError ) || ! empty( $metaError ) ) {
			return false;
		}

		// The row is gone, or Brizy_Editor_Project::createPost() rolled back its
		// transaction. Either way there is nothing of ours to repair.
		return ! is_null( $postExists );
	}

	/**
	 * @param int $postId
	 *
	 * @return string
	 */
	private static function stateOptionName( $postId ) {
		return self::STATE_OPTION_PREFIX . (int) $postId;
	}

	/**
	 * @param int $postId
	 *
	 * @return array
	 */
	private static function readState( $postId ) {

		$state = get_option( self::stateOptionName( $postId ), array() );

		return is_array( $state ) ? $state : array();
	}

	/**
	 * Rate limiting. Guarantees that a repair which does not stick cannot turn
	 * every request into a write.
	 *
	 * @param int $postId
	 * @param mixed $value
	 *
	 * @return bool
	 */
	private static function shouldAttempt( $postId, $value ) {

		$state    = self::readState( $postId );
		$attempts = isset( $state['attempts'] ) ? (int) $state['attempts'] : 0;
		$last     = isset( $state['last'] ) ? (int) $state['last'] : 0;

		if ( $attempts >= self::MAX_ATTEMPTS ) {

			// Report the surrender exactly once, otherwise the log table becomes
			// the new hot loop.
			if ( empty( $state['reported'] ) ) {
				$state['reported'] = 1;
				update_option( self::stateOptionName( $postId ), $state, false );

				Brizy_Logger::instance()->critical(
					'The project data is still invalid after ' . self::MAX_ATTEMPTS . ' automatic repair attempts. No further attempts will be made until the option ' . self::stateOptionName( $postId ) . ' is deleted.',
					self::describe( $postId, $value )
				);
			}

			return false;
		}

		if ( $last && ( time() - $last ) < self::RETRY_COOLDOWN ) {
			return false;
		}

		return true;
	}

	/**
	 * @param int $postId
	 */
	private static function recordAttempt( $postId ) {

		$state = self::readState( $postId );

		$state['attempts'] = ( isset( $state['attempts'] ) ? (int) $state['attempts'] : 0 ) + 1;
		$state['last']     = time();

		update_option( self::stateOptionName( $postId ), $state, false );
	}

	/**
	 * @param int $postId
	 */
	private static function clearState( $postId ) {
		delete_option( self::stateOptionName( $postId ) );
	}

	/**
	 * Cross process mutex, modelled on WP_Upgrader::create_lock().
	 *
	 * INSERT IGNORE against the unique index on options.option_name is the only
	 * primitive WordPress offers that is atomic between php workers and that does
	 * not depend on the object cache being shared.
	 *
	 * @param int $postId
	 *
	 * @return bool
	 */
	private static function acquireLock( $postId ) {

		global $wpdb;

		$lock = self::LOCK_OPTION_PREFIX . (int) $postId;
		$now  = time();

		$existing = $wpdb->get_var( $wpdb->prepare( "SELECT option_value FROM {$wpdb->options} WHERE option_name = %s LIMIT 1", $lock ) );

		if ( ! is_null( $existing ) ) {

			if ( ( $now - (int) $existing ) < self::LOCK_TTL ) {
				return false;
			}

			// Stale lock left behind by a fatal error. Only the request that wins
			// the conditional delete is allowed to move on.
			$removed = $wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name = %s AND option_value = %s", $lock, $existing ) );

			if ( ! $removed ) {
				return false;
			}
		}

		$acquired = $wpdb->query( $wpdb->prepare( "INSERT IGNORE INTO {$wpdb->options} (`option_name`, `option_value`, `autoload`) VALUES (%s, %s, 'no')", $lock, $now ) );

		// 0 rows: somebody else got there first. false: the database refused the
		// write, in which case repairing is hopeless anyway.
		if ( ! $acquired ) {
			return false;
		}

		wp_cache_delete( 'notoptions', 'options' );

		return true;
	}

	/**
	 * @param int $postId
	 */
	private static function releaseLock( $postId ) {

		global $wpdb;

		$lock = self::LOCK_OPTION_PREFIX . (int) $postId;

		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->options} WHERE option_name = %s", $lock ) );

		wp_cache_delete( $lock, 'options' );
		wp_cache_delete( 'notoptions', 'options' );
	}

	/**
	 * Copy the value we are about to overwrite into its own meta key.
	 *
	 * The raw serialized string of every `brizy-project` row is stored, base64
	 * encoded so that add_metadata()'s wp_unslash() cannot alter a single byte.
	 * Decode with:
	 *
	 *   $backups = get_post_meta( $projectId, 'brizy-project-backup' );
	 *   $value   = maybe_unserialize( base64_decode( $backups[0]['value'][0] ) );
	 *
	 * @param int $postId
	 * @param string $state
	 *
	 * @return bool false only when there was something to copy and copying it failed
	 */
	private static function backup( $postId, $state ) {

		$raw      = null;
		$metadata = get_metadata( 'post', $postId );

		if ( is_array( $metadata ) && isset( $metadata[ Brizy_Editor_Storage_Project::META_KEY ] ) ) {
			$rows = (array) $metadata[ Brizy_Editor_Storage_Project::META_KEY ];
			$raw  = array();

			foreach ( $rows as $row ) {
				$raw[] = base64_encode( is_string( $row ) ? $row : maybe_serialize( $row ) );
			}
		}

		$stored = add_metadata( 'post', $postId, self::BACKUP_META_KEY, array(
			'backed_up_at'   => current_time( 'mysql', 1 ),
			'plugin_version' => defined( 'BRIZY_VERSION' ) ? BRIZY_VERSION : null,
			'state'          => $state,
			'encoding'       => 'base64',
			'rows'           => is_array( $raw ) ? count( $raw ) : 0,
			'value'          => $raw,
		), false );

		// Nothing existed to be copied: losing the bookkeeping row is not a reason
		// to leave the site broken.
		if ( is_null( $raw ) ) {
			return true;
		}

		return (bool) $stored;
	}
}
