<?php

/**
 * The Cookie Banner global block.
 *
 * Owns the banner block identity (one block per site), the trash-aware lookup,
 * the two standard display rule sets, applying a rule set to the block and the
 * enable and disable operations.
 */
class Brizy_Admin_Blocks_CookieBanner {

	const UID_PREFIX = 'brz-cookie-banner-';

	/**
	 * Every status a banner block can have. WordPress 'any' excludes trash, so the
	 * statuses are listed explicitly: a trashed banner still counts as existing.
	 *
	 * @var string[]
	 */
	private static $lookupStatuses = [ 'publish', 'future', 'draft', 'pending', 'private', 'trash' ];

	/**
	 * @var Brizy_Admin_Blocks_Manager
	 */
	private $blockManager;

	/**
	 * @var Brizy_Admin_Rules_Manager
	 */
	private $rulesManager;

	/**
	 * The stored "Enable Cookie Banner" option. Never set reads as false.
	 *
	 * @return bool
	 */
	public static function isCookieBannerEnabled(): bool {
		// the second argument is throw-if-not-set, not a default
		return (bool) Brizy_Editor_Storage_Common::instance()->get( 'cookie-banner-enabled', false );
	}

	/**
	 * @param Brizy_Admin_Blocks_Manager|null $blockManager defaults to the global block manager
	 * @param Brizy_Admin_Rules_Manager|null $rulesManager
	 *
	 * @throws Exception
	 */
	public function __construct( ?Brizy_Admin_Blocks_Manager $blockManager = null, ?Brizy_Admin_Rules_Manager $rulesManager = null ) {
		$this->blockManager = $blockManager ?: new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
		$this->rulesManager = $rulesManager ?: new Brizy_Admin_Rules_Manager();
	}

	/**
	 * The banner block uid for the current site.
	 *
	 * @return string
	 */
	public function getUid() {
		return self::UID_PREFIX . get_current_blog_id();
	}

	/**
	 * Finds the banner block of the current site in any status, trash included.
	 *
	 * @return Brizy_Editor_Block|null
	 * @throws Exception
	 */
	public function findBlock() {
		$blocks = $this->blockManager->getEntities( [
			'post_status' => self::$lookupStatuses,
			'meta_key'    => 'brizy_post_uid',
			'meta_value'  => $this->getUid(),
			'orderby'     => 'ID',
			'order'       => 'ASC',
		] );

		return isset( $blocks[0] ) ? $blocks[0] : null;
	}

	/**
	 * Shows the banner on every Brizy-rendered page.
	 *
	 * With no banner block, the block is created from the Default Payload and all content is
	 * flagged for recompilation. An existing block (trashed included) is restored to publish
	 * and keeps its content. Either way the block ends with the include-all rule set, so a
	 * repeated enable repairs an earlier one that only partly succeeded.
	 *
	 * Never throws: every failure is reported as false.
	 *
	 * @return bool true when the block exists, is published and has the include-all rule set
	 */
	public function enable(): bool {
		try {
			// always look up first: the duplicate check in createEntity() does not see trash
			$block = $this->findBlock();

			if ( ! $block ) {
				return $this->createBlock();
			}

			$postId = $block->getWpPostId();

			return $this->publishBlock( $postId ) && $this->applyRules( $postId, $this->includeAllRules() );
		} catch ( Throwable $e ) {
			return false;
		}
	}

	/**
	 * Hides the banner by applying the exclude-all rule set. The block keeps its status and
	 * content, and it is never deleted. With no banner block there is nothing to hide, so
	 * nothing is created and the call succeeds.
	 *
	 * Never throws: every failure is reported as false.
	 *
	 * @return bool
	 */
	public function disable(): bool {
		try {
			$block = $this->findBlock();

			if ( ! $block ) {
				return true;
			}

			return $this->applyRules( $block->getWpPostId(), $this->excludeAllRules() );
		} catch ( Throwable $e ) {
			return false;
		}
	}

	/**
	 * The include-all rule set: the banner matches every Brizy-rendered page.
	 *
	 * @return Brizy_Admin_Rule[]
	 */
	public function includeAllRules() {
		return [ $this->createMatchAllRule( Brizy_Admin_Rule::TYPE_INCLUDE, 'include-all' ) ];
	}

	/**
	 * The exclude-all rule set: the banner matches no page.
	 *
	 * @return Brizy_Admin_Rule[]
	 */
	public function excludeAllRules() {
		return [ $this->createMatchAllRule( Brizy_Admin_Rule::TYPE_EXCLUDE, 'exclude-all' ) ];
	}

	/**
	 * Replaces all rules of the post with the given rule set.
	 *
	 * The write result is not used: saveRules() returns nothing and the meta update
	 * reports false for an unchanged value. Success is decided by reading the rules
	 * back and comparing them with the applied set.
	 *
	 * @param int $postId
	 * @param Brizy_Admin_Rule[] $rules
	 *
	 * @return bool true when the rules read back equal the applied rule set
	 */
	public function applyRules( $postId, array $rules ) {
		try {
			$this->rulesManager->setRules( $postId, $rules );

			return $this->rulesAreEqual( $rules, $this->rulesManager->getRules( $postId ) );
		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * Creates the banner block from the Default Payload, flags all content for
	 * recompilation and applies the include-all rule set.
	 *
	 * Call it only after findBlock() found nothing.
	 *
	 * @return bool
	 * @throws Exception
	 */
	private function createBlock() {
		$payload = $this->getDefaultPayload();
		$block   = $this->blockManager->createEntity( $payload['uid'], $payload['status'] );

		if ( ! $block instanceof Brizy_Editor_Block ) {
			return false;
		}

		$block->setTitle( $payload['title'] );
		$block->setPosition( Brizy_Editor_BlockPosition::createFromSerializedData( $payload['position'] ) );
		$block->setDependencies( $payload['dependencies'] );
		$block->setMeta( wp_json_encode( $payload['meta'] ) );
		$block->setEditorData( wp_json_encode( $payload['data'] ) );
		$block->save();

		// flag before the rule write, so the flag is set even when that write fails
		Brizy_Editor_Post::markAllForCompilation();

		return $this->applyRules( $block->getWpPostId(), $this->includeAllRules() );
	}

	/**
	 * Sets the banner block status to publish. Only the status changes (and the date of a
	 * block scheduled for later); title, editor data, meta and position are kept.
	 *
	 * @param int $postId
	 *
	 * @return bool true when the block is published
	 */
	private function publishBlock( $postId ) {
		$status = get_post_status( $postId );

		if ( $status === 'publish' ) {
			return true;
		}

		// since WordPress 5.6 an untrashed post goes back to draft, so it is published below
		if ( $status === 'trash' && ! wp_untrash_post( $postId ) ) {
			return false;
		}

		$post = get_post( $postId );

		if ( ! $post ) {
			return false;
		}

		if ( $post->post_status === 'publish' ) {
			return true;
		}

		$postarr = [
			'ID'          => $postId,
			'post_status' => 'publish',
		];

		// WordPress stores a publish request for a post dated in the future as future
		if ( get_post_time( 'U', true, $post ) > time() ) {
			$postarr['post_date']     = current_time( 'mysql' );
			$postarr['post_date_gmt'] = current_time( 'mysql', 1 );
			wp_clear_scheduled_hook( 'publish_future_post', [ $postId ] );
		}

		$result = wp_update_post( $postarr, true );

		if ( ! $result || is_wp_error( $result ) ) {
			return false;
		}

		return get_post_status( $postId ) === 'publish';
	}

	/**
	 * The Default Payload of a new banner block, with the current site id in place of <siteId>.
	 *
	 * The payload's rules entry is not listed here: it is the include-all rule set, and the
	 * only rule write during creation is applyRules() with includeAllRules().
	 *
	 * @return array
	 */
	private function getDefaultPayload() {
		$uid = $this->getUid();

		return [
			'uid'          => $uid,
			'title'        => 'Cookie Banner',
			'status'       => 'publish',
			'position'     => [
				'align'  => 'bottom',
				'top'    => 0,
				'bottom' => 0,
			],
			'dependencies' => [],
			'meta'         => [
				'type'            => 'overlay',
				'subtype'         => 'cookieBanner',
				'extraFontStyles' => [],
			],
			'data'         => [
				'type'    => 'CookieBanner',
				'blockId' => 'CookieBanner',
				'value'   => [
					'_id'   => $uid,
					'items' => [
						[
							'type'  => 'RichText',
							'value' => [
								'_id'          => $uid . '-text',
								'_styles'      => [ 'richText' ],
								'_version'     => 3,
								'text'         => "<p class='brz-tp-paragraph'><span class='brz-cp-color7'>We use cookies to improve your experience.</span></p>",
								'colorHex'     => '',
								'colorPalette' => 'color7',
							],
						],
					],
				],
			],
		];
	}

	/**
	 * The rule id is derived from the set name, so applying the same set again writes
	 * an identical value.
	 *
	 * @param int $type
	 * @param string $name
	 *
	 * @return Brizy_Admin_Rule
	 */
	private function createMatchAllRule( $type, $name ) {
		return new Brizy_Admin_Rule( md5( self::UID_PREFIX . $name ), $type, null, '', [] );
	}

	/**
	 * Two rule sets are equal when they have the same number of rules and each rule
	 * matches on type, appliedFor, entityType and entityValues. Order and rule ids are ignored.
	 *
	 * @param Brizy_Admin_Rule[] $expected
	 * @param Brizy_Admin_Rule[] $actual
	 *
	 * @return bool
	 */
	private function rulesAreEqual( array $expected, array $actual ) {
		if ( count( $expected ) !== count( $actual ) ) {
			return false;
		}

		$expectedKeys = $this->ruleKeys( $expected );
		$actualKeys   = $this->ruleKeys( $actual );

		return $expectedKeys !== null && $expectedKeys === $actualKeys;
	}

	/**
	 * @param Brizy_Admin_Rule[] $rules
	 *
	 * @return string[]|null sorted comparison keys, or null when an item is not a rule
	 */
	private function ruleKeys( array $rules ) {
		$keys = [];

		foreach ( $rules as $rule ) {
			if ( ! $rule instanceof Brizy_Admin_Rule ) {
				return null;
			}

			$appliedFor = $rule->getAppliedFor();
			$keys[]     = wp_json_encode( [
				(int) $rule->getType(),
				$appliedFor === null ? null : (int) $appliedFor,
				$rule->getEntityType(),
				array_values( (array) $rule->getEntityValues() ),
			] );
		}

		sort( $keys );

		return $keys;
	}
}
