<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/18/18
 * Time: 10:48 AM
 */


class Brizy_Admin_Popups_Api extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';

	const GET_GLOBAL_POPUP_BY_UID_ACTION = 'brizy-get-global-popup-by-uid';
	const GET_SAVED_POPUP_BY_UID_ACTION = 'brizy-get-saved-popup-by-uid';

	const GET_GLOBAL_POPUPS_ACTION = 'brizy-get-global-popups';
	const GET_SAVED_POPUPS_ACTION = 'brizy-get-saved-popups';

	const CREATE_GLOBAL_POPUP_ACTION = 'brizy-create-global-popup';
	const CREATE_SAVED_POPUP_ACTION = 'brizy-create-saved-popup';

	const UPDATE_GLOBAL_POPUP_ACTION = 'brizy-update-global-popup';
	const UPDATE_SAVED_POPUP_ACTION = 'brizy-saved-global-popup';
	const DELETE_GLOBAL_POPUP_ACTION = 'brizy-delete-global-popup';

	const DELETE_SAVED_POPUP_ACTION = 'brizy-delete-saved-popup';

	/**
	 * @var Brizy_Admin_Rules_Manager
	 */
	private $ruleManager;

	/**
	 * @return Brizy_Admin_Popups_Api
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self( new Brizy_Admin_Rules_Manager() );
		}

		return $instance;
	}

	/**
	 * Brizy_Admin_Popups_Api constructor.
	 *
	 * @param Brizy_Admin_Rules_Manager $ruleManager
	 */
	public function __construct( $ruleManager ) {
		$this->ruleManager = $ruleManager;

		parent::__construct();
	}

	protected function getRequestNonce() {
		return $this->param( 'hash' );
	}

	protected function initializeApiActions() {
		add_action( 'wp_ajax_' . self::GET_GLOBAL_POPUP_BY_UID_ACTION, array( $this, 'actionGetGlobalPopupByUid' ) );
		add_action( 'wp_ajax_' . self::GET_SAVED_POPUP_BY_UID_ACTION, array( $this, 'actionGetSavedPopupByUid' ) );
		add_action( 'wp_ajax_' . self::GET_GLOBAL_POPUPS_ACTION, array( $this, 'actionGetGlobalPopups' ) );
		add_action( 'wp_ajax_' . self::GET_SAVED_POPUPS_ACTION, array( $this, 'actionGetSavedPopups' ) );
		add_action( 'wp_ajax_' . self::CREATE_GLOBAL_POPUP_ACTION, array( $this, 'actionCreateGlobalPopup' ) );
		add_action( 'wp_ajax_' . self::UPDATE_GLOBAL_POPUP_ACTION, array( $this, 'actionUpdateGlobalPopup' ) );
		add_action( 'wp_ajax_' . self::UPDATE_SAVED_POPUP_ACTION, array( $this, 'actionUpdateSavedPopup' ) );
		add_action( 'wp_ajax_' . self::DELETE_GLOBAL_POPUP_ACTION, array( $this, 'actionDeleteGlobalPopup' ) );
		add_action( 'wp_ajax_' . self::CREATE_SAVED_POPUP_ACTION, array( $this, 'actionCreateSavedPopup' ) );
		add_action( 'wp_ajax_' . self::DELETE_SAVED_POPUP_ACTION, array( $this, 'actionDeleteSavedPopup' ) );
	}

	public function actionGetGlobalPopupByUid() {
		$this->verifyNonce( self::nonce );

		try {
			if ( ! $this->param( 'id' ) ) {
				$this->error( 400, 'Invalid popup id' );
			}

			$popups = get_posts( array(
				'post_type'   => Brizy_Admin_Popups_Main::CP_GLOBAL_POPUP,
				'post_status' => 'publish',
				'meta_key'    => 'brizy_post_uid',
				'meta_value'  => $this->param( 'id' ),
				'numberposts' => - 1,
				'orderby'     => 'ID',
				'order'       => 'DESC',
			) );

			if ( isset( $popups[0] ) ) {
				$popup = $popups[0];
			} else {
				return null;
			}

			$this->success( Brizy_Editor_Popup::postData( Brizy_Editor_Popup::get( $popup ) ) );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionGetSavedPopupByUid() {
		$this->verifyNonce( self::nonce );

		try {
			if ( ! $this->param( 'uid' ) ) {
				$this->error( 400, 'Invalid popup id' );
			}

			$popups = get_posts( array(
				'post_type'   => Brizy_Admin_Popups_Main::CP_SAVED_POPUP,
				'post_status' => 'publish',
				'meta_key'    => 'brizy_post_uid',
				'meta_value'  => $this->param( 'uid' ),
				'numberposts' => - 1,
				'orderby'     => 'ID',
				'order'       => 'DESC',
			) );

			if ( isset( $popups[0] ) ) {
				$popup = $popups[0];
			} else {
				return null;
			}

			$this->success( Brizy_Editor_Popup::postData( Brizy_Editor_Popup::get( $popup ) ) );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}


	public function actionGetGlobalPopups() {
		$this->verifyNonce( self::nonce );

		try {
			$bockManager = new Brizy_Admin_Popups_Manager( null );
			$popups = $bockManager->getAllPopups( Brizy_Admin_Popups_Main::CP_SAVED_POPUP, array(), array(
					'uid',
					'meta'
				)
			);

			$this->success( $popups );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionGetSavedPopups() {
		$this->verifyNonce( self::nonce );

		try {
			$cloudClient = new Brizy_Admin_Cloud_Client( Brizy_Editor_Project::get(), new WP_Http );
			$bockManager = new Brizy_Admin_Popups_Manager( $cloudClient );

			$popups = $bockManager->getAllPopups( Brizy_Admin_Popups_Main::CP_SAVED_POPUP, array(), array(
					'uid',
					'meta'
				)
			);

			$this->success( $popups );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionCreateGlobalPopup() {
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


		try {
			$editorData = stripslashes( $this->param( 'data' ) );

			$popup = $this->createPopup( $this->param( 'uid' ), 'publish', Brizy_Admin_Popups_Main::CP_GLOBAL_POPUP );
			$popup->setMeta( stripslashes( $this->param( 'meta' ) ) );
			$popup->set_editor_data( $editorData );
			$popup->set_needs_compile( true );
			$popup->save();

			do_action( 'brizy_global_popup_created', $popup );
			do_action( 'brizy_global_data_updated' );

			$this->success( Brizy_Editor_Popup::postData( $popup ) );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionCreateSavedPopup() {
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
			$data  = stripslashes( $this->param( 'data' ) );
			$popup = $this->createPopup( $this->param( 'uid' ), 'publish', Brizy_Admin_Popups_Main::CP_SAVED_POPUP );
			$popup->setMedia( stripslashes( $this->param( 'media' ) ) );
			$popup->setMeta( stripslashes( $this->param( 'meta' ) ) );
			$popup->set_editor_data( $data );
			$popup->set_needs_compile( true );
			$popup->setCloudUpdateRequired( true );
			$popup->save();

			do_action( 'brizy_saved_popup_created', $popup );
			do_action( 'brizy_global_data_updated' );

			$this->success( Brizy_Editor_Popup::postData( $popup ) );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionUpdateGlobalPopup() {
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


			$popup = $this->getPopup( $this->param( 'uid' ), Brizy_Admin_Popups_Main::CP_GLOBAL_POPUP );
			/**
			 * @var Brizy_Editor_Popup $popup ;
			 */
			$popup->setMeta( stripslashes( $this->param( 'meta' ) ) );
			$popup->set_editor_data( stripslashes( $this->param( 'data' ) ) );

			if ( (int) $this->param( 'is_autosave' ) ) {
				$popup->auto_save_post();
			} else {
				$popup->save();
				do_action( 'brizy_global_popup_updated', $popup );
				do_action( 'brizy_global_data_updated' );
			}

			$this->success( Brizy_Editor_Popup::postData( $popup ) );
		} catch
		( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionUpdateSavedPopup() {
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

			if ( ! $this->param( 'media' ) ) {
				$this->error( 400, 'Invalid media data provided' );
			}

			$popup = $this->getPopup( $this->param( 'uid' ), Brizy_Admin_Popups_Main::CP_SAVED_POPUP );

			$popup->set_editor_data( stripslashes( $this->param( 'data' ) ) );
			$popup->setMedia( stripslashes( $this->param( 'media' ) ) );
			$popup->setMeta( stripslashes( $this->param( 'meta' ) ) );

			if ( (int) $this->param( 'is_autosave' ) ) {
				$popup->auto_save_post();
			} else {
				$popup->save();
				do_action( 'brizy_saved_popup_updated', $popup );
				do_action( 'brizy_saved_data_updated' );
			}

			$this->success( Brizy_Editor_Popup::postData( $popup ) );
		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionDeleteGlobalPopup() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'uid' ) ) {
			$this->error( '400', 'Invalid uid' );
		}

		$popup = $this->getPopup( $this->param( 'uid' ), Brizy_Admin_Popups_Main::CP_GLOBAL_POPUP );

		if ( $popup ) {
			do_action( 'brizy_global_popup_deleted', $popup );
			do_action( 'brizy_global_data_deleted' );
			$this->deletePopup( $this->param( 'uid' ), Brizy_Admin_Popups_Main::CP_GLOBAL_POPUP );
			$this->success( null );
		}

		$this->error( '404', 'Popup not found' );
	}

	public function actionDeleteSavedPopup() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'uid' ) ) {
			$this->error( '400', 'Invalid uid' );
		}

		$popup = $this->getPopup( $this->param( 'uid' ), Brizy_Admin_Popups_Main::CP_SAVED_POPUP );

		if ( $popup ) {
			do_action( 'brizy_global_popup_deleted', $popup );
			do_action( 'brizy_global_data_deleted' );
			$this->deletePopup( $this->param( 'uid' ), Brizy_Admin_Popups_Main::CP_SAVED_POPUP );
			$this->success( null );
		}

		if ( $this->deletePopup( $this->param( 'uid' ), Brizy_Admin_Popups_Main::CP_SAVED_POPUP ) ) {
			do_action( 'brizy_saved_popup_deleted', $this->param( 'uid' ) );
			do_action( 'brizy_saved_data_deleted' );
			$this->success( null );
		}

		$this->error( '404', 'Popup not found' );
	}

	/**
	 * @param $uid
	 * @param $postType
	 *
	 * @return string|null
	 */
	private function getPopupIdByUidAndPopupType( $uid, $postType ) {
		global $wpdb;

		$prepare = $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} p 
								JOIN {$wpdb->postmeta} pm  ON 
								pm.post_id=p.ID and 
								meta_key='brizy_post_uid' and 
								meta_value='%s'   
								WHERE p.post_type IN ('%s')
								ORDER BY p.ID DESC
								LIMIT 1", array( $uid, $postType ) );

		return $wpdb->get_var( $prepare );
	}

	/**
	 * @param $uid
	 * @param $postType
	 *
	 * @return string|null
	 */
	private function getPopupIdByUid( $uid ) {
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
	 * @return Brizy_Editor_Popup|null
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	private function getPopup( $id, $postType ) {
		$postId = $this->getPopupIdByUidAndPopupType( $id, $postType );

		return Brizy_Editor_Popup::get( $postId );
	}

	/**
	 * @param $uid
	 * @param $status
	 * @param $type
	 *
	 * @return Brizy_Editor_Popup|null
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	private function createPopup( $uid, $status, $type ) {
		$name = md5( time() );
		$post = wp_insert_post( array(
			'post_title'  => $name,
			'post_name'   => $name,
			'post_status' => $status,
			'post_type'   => $type
		) );

		if ( $post ) {
			$brizyPost = Brizy_Editor_Popup::get( $post, $uid );
			$brizyPost->set_uses_editor( true );
			$brizyPost->set_needs_compile( true );

			return $brizyPost;
		}

		throw new Exception( 'Unable to create popup' );
	}


	/**
	 * @param $postUid
	 * @param $postType
	 *
	 * @return false|WP_Post|null
	 */
	private function deletePopup( $postUid, $postType ) {

		$postId = $this->getPopupIdByUidAndPopupType( $postUid, $postType );

		return wp_delete_post( $postId );
	}


}