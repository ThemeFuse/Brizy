<?php

/**
 * The Cookie Banner global block.
 *
 * Owns the banner block identity (one block per site), the trash-aware lookup, the include-all display rule set and the enable and disable operations.
 */
class Brizy_Admin_Blocks_CookieBanner {

	const UID_PREFIX = 'brz-cookie-banner-';

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
	 * @return string
	 */
	private function getUid() {
		return self::UID_PREFIX . get_current_blog_id();
	}

	/**
	 * Finds the banner block of the current site in any status, trash included.
	 *
	 * @return Brizy_Editor_Block|null
	 * @throws Exception
	 */
	private function findBlock() {
		$blocks = $this->blockManager->getEntities( [
			'post_status' => [ 'publish', 'future', 'draft', 'pending', 'private', 'trash' ],
			'meta_key'    => 'brizy_post_uid',
			'meta_value'  => $this->getUid(),
			'orderby'     => 'ID',
			'order'       => 'ASC',
		] );

		return isset( $blocks[0] ) ? $blocks[0] : null;
	}

	/**
	 * Shows the banner on every Brizy-rendered page: the block is created when missing, published, given the include-all rule set and the option is turned on. Never throws.
	 *
	 * @return bool false when a step threw, true otherwise
	 */
	public function enable(): bool {
		try {
			// always look up first: the duplicate check in createEntity() does not see trash
			$block = $this->findBlock();

			if ( ! $block ) {
				$block = $this->createBlock();
			}

			$postId = $block->getWpPostId();

			$this->setBlockStatus( $postId, 'publish' );

			$this->applyRules( $postId, $this->includeAllRules() );

			Brizy_Editor_Storage_Common::instance()->set( 'cookie-banner-enabled', true );

			return true;

		} catch ( Throwable $e ) {
			return false;
		}
	}

	/**
	 * Hides the banner by moving the block to draft, which drops it from the published global blocks; the block keeps its content and is never deleted. With no banner block there is nothing to hide. Never throws.
	 *
	 * @return bool false when a step threw, true otherwise
	 */
	public function disable(): bool {
		try {
			$block = $this->findBlock();

			if ( $block ) {
				$this->setBlockStatus( $block->getWpPostId(), 'draft' );
			}

			Brizy_Editor_Storage_Common::instance()->set( 'cookie-banner-enabled', false );

			return true;
		} catch ( Throwable $e ) {
			return false;
		}
	}

	/**
	 * The include-all rule set: the banner matches every Brizy-rendered page.
	 *
	 * @return Brizy_Admin_Rule[]
	 */
	private function includeAllRules() {
		return [ $this->createMatchAllRule( Brizy_Admin_Rule::TYPE_INCLUDE, 'include-all' ) ];
	}

	/**
	 * Replaces all rules of the post with the given rule set. saveRules() returns nothing, so only a thrown error counts as a failure.
	 *
	 * @param int $postId
	 * @param Brizy_Admin_Rule[] $rules
	 *
	 * @return bool false when the rule write threw
	 */
	private function applyRules( $postId, array $rules ) {
		try {
			$this->rulesManager->setRules( $postId, $rules );

			return true;
		} catch ( Exception $e ) {
			return false;
		}
	}

	/**
	 * Creates the banner block from the Default Payload
	 *
	 * @return Brizy_Editor_Block
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

		return $block;
	}

	/**
	 * Sets the banner block status to the given one; title, editor data, meta and position are kept. Trashing is not supported: WordPress trashes a post through wp_trash_post().
	 *
	 * @param int $postId
	 * @param string $status a post status other than 'trash'
	 *
	 * @return bool false when the status write failed
	 */
	private function setBlockStatus( $postId, $status ) {
		$currentStatus = get_post_status( $postId );

		if ( $currentStatus === $status ) {
			return true;
		}

		$postarr = [
			'ID'          => $postId,
			'post_status' => $status,
		];

		$result = wp_update_post( $postarr, true );

		if ( ! $result || is_wp_error( $result ) ) {
			return false;
		}

		return true;
	}

	/**
	 * The default payload of a new banner block: the fields createBlock() writes, with the uid of the current site. Display rules are not part of it, enable() applies them.
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
}
