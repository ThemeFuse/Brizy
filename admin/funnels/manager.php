<?php


class Brizy_Admin_Funnels_Manager extends Brizy_Admin_Entity_AbstractManager {

	/**
	 * @var
	 */
	private $type;

	/**
	 * Brizy_Admin_Blocks_Manager constructor.
	 *
	 * @param $type
	 *
	 * @throws Exception
	 */
	public function __construct( $type ) {
		if ( ! self::isSupportedPostType( $type ) ) {
			throw new Exception( 'Unsupported funnel post type' );
		}

		$this->type = $type;
	}

	public static function isSupportedPostType( $type ) {
		return in_array( $type, [
			Brizy_Admin_Funnels_Main::CP_FUNNEL_PAGE,
			Brizy_Admin_Funnels_Main::CP_FUNNEL_POPUP
		] );
	}

	public function getPostIdByUid( $uid ) {
		global $wpdb;

		return $wpdb->get_var(
			$wpdb->prepare(
				"SELECT post_id 
                       FROM $wpdb->postmeta 
                       WHERE meta_key = 'brizy_post_uid' AND  meta_value = %s LIMIT 1",
				array( $uid )
			)
		);
	}

	/**
	 * @param $args
	 *
	 * @return array|Brizy_Editor_Block|Brizy_Editor_Post|mixed|null
	 */
	public function getEntities( $args ) {
		return $this->getEntitiesByType( $this->type, $args );
	}

	public static function sortByPosition( $posts ) {
		usort(
			$posts,
			function ( $a, $b ) {
				/**
				 * @var Brizy_Editor_FunnelPopup $a ;
				 * @var Brizy_Editor_FunnelPopup $b ;
				 */
				if ( $a->getFunnelMeta()->position == $b->getFunnelMeta()->position ) {
					return 0;
				}

				return $a->getFunnelMeta()->position > $b->getFunnelMeta()->position ? - 1 : 1;
			}
		);

		return $posts;
	}

	public function getEntitiesByParent( $parent, $args = [] ) {
		$filterArgs = array(
			'post_parent' => (int) $parent,
			'post_type' => [ Brizy_Admin_Funnels_Main::CP_FUNNEL_PAGE, Brizy_Admin_Funnels_Main::CP_FUNNEL_POPUP ],
			'posts_per_page' => - 1,
			'post_status' => get_post_stati(),
		);
		$filterArgs = array_merge( $filterArgs, $args );

		$posts = get_posts( $filterArgs );

		$entities = [];
		foreach ( $posts as $apost ) {
			$entities[] = $this->convertWpPostToEntity( $apost );
		}

		$entities = self::sortByPosition( $entities );

		return $entities;
	}

	public function getNextFunnelPost( $currentPost ) {

		global $wpdb;

		$parentId = $currentPost->getWpPostParentId();

		$position = 0;

		if ( $currentPost instanceof Brizy_Editor_FunnelPopup || $currentPost instanceof Brizy_Editor_FunnelPage ) {
			$funnelMeta = $currentPost->getFunnelMeta();
			if ( isset( $funnelMeta->position ) ) {
				$position = $funnelMeta->position;
			}
		}


		$rows = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT ID,post_type FROM $wpdb->posts 
                       WHERE post_parent=%d and 
                          post_status='publish' and 
                          (post_type = %s OR post_type=%s)",
				[ $parentId, Brizy_Admin_Funnels_Main::CP_FUNNEL_PAGE, Brizy_Admin_Funnels_Main::CP_FUNNEL_POPUP ]
			),
			ARRAY_A
		);

		$passedTheCurrentPost = false;
		foreach ( $rows as $p ) {
			/**
			 * @var Brizy_Editor_Entity $funnelPost ;
			 */

			$pos = get_metadata( 'post', $p['ID'], Brizy_Editor_FunnelPage::BRIZY_FUNNEL_META, true );

			if ( isset( $pos->position ) && $pos->position == $position ) {
				$passedTheCurrentPost = true;
				continue;
			}

			if ( $passedTheCurrentPost ) {
				return Brizy_Editor_Entity::get( $p['ID'] );
			}
		}

		return null;
	}

	public function getPreviousFunnelPost( $currentPost ) {

		global $wpdb;

		$parentId = $currentPost->getWpPostParentId();
		$position = 0;

		if ( $currentPost instanceof Brizy_Editor_FunnelPopup || $currentPost instanceof Brizy_Editor_FunnelPage ) {
			$funnelMeta = $currentPost->getFunnelMeta();
			if ( isset( $funnelMeta->position ) ) {
				$position = $funnelMeta->position;
			}
		}

		$rows = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT ID FROM $wpdb->posts 
                    WHERE post_parent=%d and 
                          post_status='publish' and 
                          (post_type = %s OR post_type=%s)",
				[ $parentId, Brizy_Admin_Funnels_Main::CP_FUNNEL_PAGE, Brizy_Admin_Funnels_Main::CP_FUNNEL_POPUP ]
			),
			ARRAY_A
		);

		$prevPost = null;
		foreach ( $rows as $p ) {
			/**
			 * @var Brizy_Editor_Entity $funnelPost ;
			 */

			$pos = get_metadata( 'post', $p['ID'], Brizy_Editor_FunnelPage::BRIZY_FUNNEL_META, true );

			if ( isset( $pos->position ) && $pos->position == $position ) {

				if ( $prevPost ) {
					return Brizy_Editor_Entity::get( $prevPost['ID'] );
				} else {
					return null;
				}
			}

			$prevPost = $p;
		}

		return null;
	}

	public function markAllFunnelsToNeedCompiler( $parentPostId ) {
		global $wpdb;

		$wpdb->get_results( $wpdb->prepare( "
	        UPDATE {$wpdb->postmeta} pm 
			JOIN {$wpdb->posts} p ON pm.post_id=p.ID and p.post_parent=%d
			SET pm.meta_value=1
			WHERE pm.meta_key='brizy-need-compile'", [ $parentPostId ] ) );
	}

	/**
	 * @param Brizy_Editor_Entity $entity
	 */
	public function deleteEntity( Brizy_Editor_Entity $entity, $force_delete = false ) {
		parent::deleteEntity( $entity, $force_delete );
		if ( $entity->getWpPost()->post_parent != 0 ) {
			$this->markAllFunnelsToNeedCompiler( $entity->getWpPost()->post_parent );
		}
	}

	/**
	 * @param $uid
	 *
	 * @return Brizy_Editor_Entity|null
	 * @throws Exception
	 */
	public function getEntity( $uid ) {
		return $this->getEntityUidAndType( $uid, $this->type );
	}

	/**
	 * @param $uid
	 * @param string $status
	 * @param null $properties
	 *
	 * @return mixed|null
	 */
	public function createEntity( $uid, $status = 'publish', $properties = null ) {
		/**
		 * @var  Brizy_Editor_Entity $post ;
		 */
		$post = $this->createEntityByType( $uid, $this->type, $status, $properties );
		update_post_meta( $post->getWpPostId(), '_wp_page_template', Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME );

		return $post;
	}


	/**
	 * @param $post
	 * @param null $uid
	 *
	 * @return Brizy_Editor_FunnelPage|Brizy_Editor_FunnelPopup|Brizy_Editor_Post|mixed
	 * @throws Exception
	 */
	protected function convertWpPostToEntity( $post, $uid = null ) {
		return Brizy_Editor_Entity::get( $post );
	}
}
