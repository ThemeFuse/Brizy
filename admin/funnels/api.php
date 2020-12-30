<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/18/18
 * Time: 10:48 AM
 */


class Brizy_Admin_Funnels_Api extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';

	const GET_FUNNEL_POSTS = '_funnel_get_subposts';
	const CREATE_FUNNEL_POST = '_funnel_create_post';
	const UPDATE_FUNNEL_POST = '_funnel_update_post';
	const DELETE_FUNNEL_POST = '_funnel_delete_post';

	/**
	 * @return Brizy_Admin_Layouts_Api
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self();
		}

		return $instance;
	}

	protected function getRequestNonce() {
		return $this->param( 'hash' );
	}

	protected function initializeApiActions() {
		$pref = 'wp_ajax_' . Brizy_Editor::prefix();
		add_action( $pref . self::GET_FUNNEL_POSTS, array( $this, 'actionGetPosts' ) );
		add_action( $pref . self::CREATE_FUNNEL_POST, array( $this, 'actionCreatePost' ) );
		add_action( $pref . self::UPDATE_FUNNEL_POST, array( $this, 'actionUpdatePost' ) );
		add_action( $pref . self::DELETE_FUNNEL_POST, array( $this, 'actionDeletePost' ) );
	}

	public function actionGetPosts() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'parentId' ) ) {
			$this->error( 400, 'Invalid parentId' );
		}

		try {
			$manager = new Brizy_Admin_Funnels_Manager( Brizy_Admin_Funnels_Main::CP_FUNNEL_POPUP );

			$fields = $this->param( 'fields' ) ? $this->param( 'fields' ) : [];

			$posts = $manager->getEntitiesByParent(
				$this->param( 'parentId' ),
				[
					'post_status' => get_post_stati(),
				]
			);
			$posts = apply_filters(
				'brizy_get_funnel_subposts',
				$manager->createResponseForEntities( $posts, $fields ),
				$fields,
				$manager
			);
			$this->success( $posts );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionCreatePost() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'parentId' ) ) {
			$this->error( 400, 'Invalid parentId' );
		}

		if ( ! $this->param( 'uid' ) ) {
			$this->error( 400, 'Invalid uid' );
		}

		if ( ! $this->param( 'postType' ) ||
		     ! Brizy_Admin_Funnels_Manager::isSupportedPostType( $this->param( 'postType' ) )
		) {
			$this->error( 400, 'Invalid type' );
		}

		if ( ! $this->param( 'title' ) ) {
			$this->error( 400, 'Invalid title' );
		}

		if ( ! $this->param( 'funnelMeta' ) ) {
			$this->error( 400, 'Invalid funnelMeta' );
		}

		$meta = json_decode( stripslashes( $this->param( 'funnelMeta' ) ) );

		if ( ! isset( $meta->position ) ) {
			$this->error( 400, 'Invalid meta content' );
		}

		try {

			$manager = new Brizy_Admin_Funnels_Manager( $this->param( 'postType' ) );

			$post = $manager->createEntity(
				$this->param( 'uid' ),
				'draft',
				[
					'post_title'  => $this->param( 'title' ),
					'post_parent' => $this->param( 'parentId' ),
				]
			);
			$post->setFunnelMeta( $meta );
			$post->setDataVersion( 1 );
			$post->save( 0 );
			do_action( 'brizy_funnel_subpost_created', $post );

			$this->success( $post->createResponse() );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionUpdatePost() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'parentId' ) ) {
			$this->error( 400, 'Invalid parentUid' );
		}

		if ( ! $this->param( 'uid' ) ) {
			$this->error( 400, 'Invalid uid' );
		}

		if ( ! $this->param( 'postType' ) ||
		     ! Brizy_Admin_Funnels_Manager::isSupportedPostType( $this->param( 'postType' ) )
		) {
			$this->error( 400, 'Invalid type' );
		}

		if ( ! $this->param( 'title' ) ) {
			$this->error( 400, 'Invalid title' );
		}

		if ( ! $this->param( 'slug' ) ) {
			$this->error( 400, 'Invalid slug' );
		}

		if ( ! $this->param( 'funnelMeta' ) ) {
			$this->error( 400, 'Invalid funnelMeta' );
		}

		$meta = json_decode( stripslashes( $this->param( 'funnelMeta' ) ) );

		if ( ! isset( $meta->position ) ) {
			$this->error( 400, 'Invalid meta content' );
		}

		if ( ! $this->param( 'dataVersion' ) ) {
			$this->error( 400, 'Invalid data version' );
		}

		try {

			$manager = new Brizy_Admin_Funnels_Manager( $this->param( 'postType' ) );
			$post    = $manager->getEntity( $this->param( 'uid' ) );

			if ( ! $post ) {
				$this->error( 400, 'Invalid post' );
			}

			wp_update_post( [ 'ID'         => $post->getWpPostId(),
			                  'post_name'  => $this->param( 'slug' ),
			                  'post_title' => $this->param( 'title' )
			] );
			$post->setFunnelMeta( $meta );
			$post->setDataVersion( $this->param( 'dataVersion' ) );
			$post->save( 0 );


			do_action( 'brizy_funnel_subpost_updated', $post );

			if ( $post->getWpPost()->post_parent != 0 ) {
				$this->markAllFunnelsToNeedCompiler( $post->getWpPost()->post_parent );
			}

			$this->success( $post->createResponse() );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionDeletePost() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'uid' ) ) {
			$this->error( '400', 'Invalid uid' );
		}

		if ( ! $this->param( 'type' ) ) {
			$this->error( '400', 'Invalid type' );
		}
		$manager = new Brizy_Admin_Funnels_Manager( $this->param( 'type' ) );
		$post    = $manager->getEntity( $this->param( 'uid' ) );

		if ( $post ) {
			do_action( 'brizy_funnel_subpost_deleted', $post );
			$manager->deleteEntity( $post, true );
			$this->success( null );
		}

		$this->error( '404', 'Post not found' );
	}
}
