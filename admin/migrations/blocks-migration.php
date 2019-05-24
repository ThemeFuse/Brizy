<?php

class Brizy_Admin_Migrations_BlocksMigration implements Brizy_Admin_Migrations_MigrationInterface {

	/**
	 * Return the version
	 *
	 * @return mixed
	 */
	public function getVersion() {
		return '1.0.76';
	}

	/**
	 * @return mixed
	 */
	public function getPriority() {
		return 0;
	}


	/**
	 * @return int|mixed|WP_Error
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function execute() {

		throw new Exception();

		$pages              = $this->getAllPages();
		$globalBlocks       = $this->getGlobalBlocks();
		$transformer        = new \Brizy\ConditionsTransformer();
		$transformerContext = new Brizy\ConditionsContext( $globalBlocks );
		foreach ( $pages as $page ) {

			$storage = Brizy_Editor_Storage_Post::instance( $page->ID );

			$pageConfig = $this->getConfig( $page );

			$transformerContext->setData( $storage->get( Brizy_Editor_Post::BRIZY_POST, false ) );
			$transformerContext->setConfig( $pageConfig );

			$transformer->execute( $transformerContext );

			// backup page data
			// update_post_meta( $page->ID, 'brizy-bk-' . get_class( $this ) . '-' . $this->getVersion(), $storage->get_storage() );
			// save globas blocks and page data
		}

		exit;
	}

	private function getGlobalBlocks() {
		$globalBlocks = array();

		$blocks = get_posts( array(
			'post_type'      => Brizy_Admin_Blocks_Main::CP_GLOBAL,
			'posts_per_page' => - 1,
			'post_status'    => 'publish',
			'orderby'        => 'ID',
			'order'          => 'ASC',
		) );

		foreach ( $blocks as $block ) {
			$brizy_editor_block                  = Brizy_Editor_Block::get( $block );
			$uid                                 = $brizy_editor_block->get_uid();
			$globalBlocks[ $uid ]                = $brizy_editor_block->convertToOptionValue();
			$globalBlocks[ $uid ]['editor_data'] = base64_decode( $globalBlocks[ $uid ]['editor_data'] );
			//$globalBlocks[ $uid ]['position']    = json_decode( $globalBlocks[ $uid ]['position'] );
			//$globalBlocks[ $uid ]['rules']    = json_decode( $globalBlocks[ $uid ]['position'] );
		}


		return $globalBlocks;
	}

	private function getAllPages() {
		global $wpdb;
		$posts = $wpdb->get_results(
			$wpdb->prepare( "SELECT p.ID,p.post_type FROM {$wpdb->postmeta} pm 
									JOIN {$wpdb->posts} p ON p.ID=pm.post_id and p.post_type <> 'revision'
									WHERE pm.meta_key = %s and p.post_type NOT IN ( '" . Brizy_Admin_Blocks_Main::CP_GLOBAL . "','" . Brizy_Admin_Blocks_Main::CP_SAVED . "' )", Brizy_Editor_Storage_Post::META_KEY )
		);

		return $posts;
	}


	private function getConfig( $post ) {
		$config = array(
			'page'        => $post->ID,
			'isTemplate'  => $post->post_type == Brizy_Admin_Templates::CP_TEMPLATE,
			'ruleMatches' => $this->getRuleMatches( $post )
		);

		return $config;
	}

	private function getRuleMatches( $post ) {
		$ruleMatches = array();
		if ( $post->post_type == Brizy_Admin_Templates::CP_TEMPLATE ) {
			$rule_manager   = new Brizy_Admin_Rules_Manager();
			$template_rules = $rule_manager->getRules( $post->ID );

			foreach ( $template_rules as $rule ) {
				/**
				 * @var Brizy_Admin_Rule $rule ;
				 */
				$ruleMatches[] = array(
					'type'       => $rule->getType(),
					'group'      => $rule->getAppliedFor(),
					'entityType' => $rule->getEntityType(),
					'values'     => $rule->getEntityValues()
				);
			}
		} else {
			$ruleMatches[] = array(
				'type'       => Brizy_Admin_Rule::TYPE_INCLUDE,
				'group'      => Brizy_Admin_Rule::POSTS,
				'entityType' => $post->post_type,
				'values'     => array( $post->ID )
			);
		}

		return $ruleMatches;
	}
}