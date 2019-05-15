<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/18/18
 * Time: 10:48 AM
 */


class Brizy_Admin_Layouts_Api extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';

	const GET_LAYOUT_BY_UID_ACTION = 'brizy-get-layout-by-uid';
	const GET_LAYOUTS_ACTION = 'brizy-get-layouts';
	const CREATE_LAYOUT_ACTION = 'brizy-create-layout';
	const UPDATE_LAYOUT_ACTION = 'brizy-update-layout';
	const DELETE_LAYOUT_ACTION = 'brizy-delete-layout';

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
		add_action( 'wp_ajax_' . self::GET_LAYOUT_BY_UID_ACTION, array( $this, 'actionGetLayoutByUid' ) );
		add_action( 'wp_ajax_' . self::GET_LAYOUTS_ACTION, array( $this, 'actionGetLayouts' ) );
		add_action( 'wp_ajax_' . self::CREATE_LAYOUT_ACTION, array( $this, 'actionCreateLayout' ) );
		add_action( 'wp_ajax_' . self::UPDATE_LAYOUT_ACTION, array( $this, 'actionUpdateLayout' ) );
		add_action( 'wp_ajax_' . self::DELETE_LAYOUT_ACTION, array( $this, 'actionDeleteLayout' ) );
	}

	public function actionGetLayoutByUid() {
		$this->verifyNonce( self::nonce );

		try {
			$uid = $this->param( 'uid' );
			if ( ! $uid ) {
				$this->error( 400, 'Invalid layout id' );
			}

			$layout = $this->getLayout( $uid );

			$this->success( $layout->createResponse() );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionGetLayouts() {
		$this->verifyNonce( self::nonce );

		try {
			$cloudClient   = new Brizy_Admin_Cloud_Client( Brizy_Editor_Project::get(), new WP_Http );
			$layoutManager = new Brizy_Admin_Layouts_Manager( $cloudClient );

			$layouts = $layoutManager->getAllLayouts( array(), is_array( $this->param( 'fields' ) ) ? $this->param( 'fields' ) : array() );

			$this->success( $layouts );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionCreateLayout() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'uid' ) ) {
			$this->error( 400, 'Invalid uid' );
		}

		if ( ! $this->param( 'data' ) ) {
			$this->error( 400, 'Invalid data' );
		}

		if ( ! $this->param( 'meta' ) ) {
			$this->error( 400, 'Invalid meta data' );
		}

		if ( ! $this->param( 'media' ) ) {
			$this->error( 400, 'Invalid media data provided' );
		}

		try {
			$editorData = stripslashes( $this->param( 'data' ) );

			$layout = $this->createLayout( $this->param( 'uid' ), 'publish', Brizy_Admin_Layouts_Main::CP_LAYOUT );

			$layout->setMedia( stripslashes( $this->param( 'media' ) ) );
			$layout->setMeta( stripslashes( $this->param( 'meta' ) ) );
			$layout->set_editor_data( $editorData );
			$layout->set_needs_compile( true );
			$layout->setCloudUpdateRequired( true );
			$layout->setDataVersion( 1 );
			$layout->save();

			do_action( 'brizy_layout_created', $layout );
			do_action( 'brizy_global_data_updated' );

			$this->success( $layout->createResponse() );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionUpdateLayout() {
		$this->verifyNonce( self::nonce );

		try {

			if ( ! $this->param( 'uid' ) ) {
				$this->error( '400', 'Invalid uid' );
			}

			if ( ! $this->param( 'data' ) ) {
				$this->error( '400', 'Invalid data' );
			}

			if ( ! $this->param( 'meta' ) ) {
				$this->error( 400, 'Invalid meta data' );
			}

			if ( ! $this->param( 'dataVersion' ) ) {
				$this->error( 400, 'Invalid data version' );
			}

			$layout = $this->getLayout( $this->param( 'uid' ), Brizy_Admin_Layouts_Main::CP_LAYOUT );
			/**
			 * @var Brizy_Editor_Layout $layout ;
			 */
			$layout->setMeta( stripslashes( $this->param( 'meta' ) ) );
			$layout->set_editor_data( stripslashes( $this->param( 'data' ) ) );
			$layout->setDataVersion( $this->param( 'dataVersion' ) );

			if ( (int) $this->param( 'is_autosave' ) ) {
				$layout->save( 1 );
			} else {
				$layout->save();
				do_action( 'brizy_layout_updated', $layout );
				do_action( 'brizy_global_data_updated' );
			}

			$this->success( $layout->createResponse() );
		} catch
		( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionDeleteLayout() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'uid' ) ) {
			$this->error( '400', 'Invalid uid' );
		}

		$layout = $this->getLayout( $this->param( 'uid' ) );

		if ( $layout ) {
			do_action( 'brizy_layout_deleted', $layout );
			do_action( 'brizy_global_data_deleted' );
			$this->deleteLayout( $this->param( 'uid' ) );
			$this->success( null );
		}

		$this->error( '404', 'Layout not found' );
	}

	/**
	 * @param $uid
	 * @param $postType
	 *
	 * @return string|null
	 */
	private function getLayoutIdByUid( $uid ) {
		global $wpdb;

		$prepare = $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} p 
								JOIN {$wpdb->postmeta} pm  ON 
								pm.post_id=p.ID and 
								meta_key='brizy_post_uid' and 
								meta_value='%s'   
								ORDER BY p.ID DESC
								LIMIT 1", array( $uid, ) );

		return $wpdb->get_var( $prepare );
	}

	/**
	 * @param $id
	 * @param $postType
	 *
	 * @return Brizy_Editor_Layout|null
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	private function getLayout( $uid ) {
		$postId = $this->getLayoutIdByUid( $uid );

		return Brizy_Editor_Layout::get( $postId );
	}

	/**
	 * @param $uid
	 * @param $status
	 * @param $type
	 *
	 * @return Brizy_Editor_Layout|null
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	private function createLayout( $uid, $status, $type ) {
		$name = md5( time() );
		$post = wp_insert_post( array(
			'post_title'  => $name,
			'post_name'   => $name,
			'post_status' => $status,
			'post_type'   => $type
		) );

		if ( $post ) {
			$brizyPost = Brizy_Editor_Layout::get( $post, $uid );
			$brizyPost->set_uses_editor( true );
			$brizyPost->set_needs_compile( true );

			return $brizyPost;
		}

		throw new Exception( 'Unable to create layout' );
	}


	/***
	 * @param $postUid
	 *
	 * @return false|WP_Post|null
	 */
	private function deleteLayout( $postUid ) {

		$postId = $this->getLayoutIdByUid( $postUid );

		return wp_delete_post( $postId );
	}


}