<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/18/18
 * Time: 10:48 AM
 */


class Brizy_Admin_Layouts_Api extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';

	const GET_LAYOUT_BY_UID_ACTION = '-get-layout-by-uid';
	const GET_LAYOUTS_ACTION = '-get-layouts';
	const CREATE_LAYOUT_ACTION = '-create-layout';
	const UPDATE_LAYOUT_ACTION = '-update-layout';
	const DELETE_LAYOUT_ACTION = '-delete-layout';
	const DOWNLOAD_LAYOUTS = '-download-layouts';
	const UPLOAD_LAYOUTS = '-upload-layouts';

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
		add_action( $pref . self::DOWNLOAD_LAYOUTS, array( $this, 'actionDownloadLayouts' ) );
		add_action( $pref . self::GET_LAYOUT_BY_UID_ACTION, array( $this, 'actionGetLayoutByUid' ) );
		add_action( $pref . self::GET_LAYOUTS_ACTION, array( $this, 'actionGetLayouts' ) );
		add_action( $pref . self::CREATE_LAYOUT_ACTION, array( $this, 'actionCreateLayout' ) );
		add_action( $pref . self::UPDATE_LAYOUT_ACTION, array( $this, 'actionUpdateLayout' ) );
		add_action( $pref . self::DELETE_LAYOUT_ACTION, array( $this, 'actionDeleteLayout' ) );
	}

	public function actionDownloadLayouts() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'uid' ) ) {
			$this->error( 400, 'Invalid layout uid param' );
		}

		try {
			$bockManager = new Brizy_Admin_Layouts_Manager();
			$uids        = [];
			// this is not a very eficien solution if you have a big array of uids

			$explode = explode( ',', $this->param( 'uid' ) );
			$items   = array_map( function ( $auid ) use ( $uids, $bockManager ) {
				list( $uid, $isPro ) = explode( ':', $auid );
				$uids[] = $uid;
				$item   = new Brizy_Editor_Zip_ArchiveItem( $uid, $isPro );

				if ( $post = $bockManager->getEntity( $uid ) ) {
					$item->setPost( $post );

					return $item;
				}

				return null;
			}, $explode );
			$items = array_filter( $items );
			if ( count( $items ) == 0 ) {
				$this->error( 404, __( 'There are no layouts to be archived' ) );
			}

			$zipPath     = "Layout-" . date( DATE_ATOM ) . ".zip";
			$fontManager = new Brizy_Admin_Fonts_Manager();
			$zip         = new Brizy_Editor_Zip_Archiver( Brizy_Editor_Project::get(),
				$fontManager,
				BRIZY_EDITOR_VERSION );
			$zipPath     = $zip->createZip( $items, $zipPath );

			header( "Pragma: public" );
			header( "Expires: 0" );
			header( "Cache-Control: must-revalidate, post-check=0, pre-check=0" );
			header( "Cache-Control: private", false );
			header( "Content-Type: application/octet-stream" );
			header( "Content-Disposition: attachment; filename=\"" . basename( $zipPath ) . "\";" );
			header( "Content-Transfer-Encoding: binary" );

			echo file_get_contents( $zipPath );
			exit;
		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionGetLayoutByUid() {
		$this->verifyNonce( self::nonce );

		try {
			$uid = $this->param( 'uid' );
			if ( ! $uid ) {
				$this->error( 400, 'Invalid layout id' );
			}

			$fields = $this->param( 'fields' ) ? $this->param( 'fields' ) : [];

			$layoutManager = new Brizy_Admin_Layouts_Manager();

			$layout = $layoutManager->getEntity( $this->param( 'uid' ) );

			$layout = apply_filters( 'brizy_get_layout', $layout, $this->param( 'uid' ), $layoutManager );

			if ( ! $layout ) {
				$this->error( 404, 'Block not found' );
			}

			$this->success( $layout->createResponse( $fields ) );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionGetLayouts() {
		$this->verifyNonce( self::nonce );

		try {
			$layoutManager = new Brizy_Admin_Layouts_Manager();

			$fields = $this->param( 'fields' ) ? $this->param( 'fields' ) : [];

			$layouts = $layoutManager->getEntities( array() );
			$layouts = apply_filters( 'brizy_get_layouts',
				$layoutManager->createResponseForEntities( $layouts, $fields ),
				$fields,
				$layoutManager );
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
			$editorData    = stripslashes( $this->param( 'data' ) );
			$layoutManager = new Brizy_Admin_Layouts_Manager();
			$layout        = $layoutManager->createEntity( $this->param( 'uid' ), 'publish' );

			$layout->setMedia( stripslashes( $this->param( 'media' ) ) );
			$layout->setMeta( stripslashes( $this->param( 'meta' ) ) );
			$layout->set_editor_data( $editorData );
			$layout->set_needs_compile( true );
			//$layout->setCloudUpdateRequired( true );
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
			$layoutManager = new Brizy_Admin_Layouts_Manager();
			$layout        = $layoutManager->getEntity( $this->param( 'uid' ) );

			if ( ! $layout ) {
				$this->error( 400, 'Layout not found' );
			}

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
		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionDeleteLayout() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'uid' ) ) {
			$this->error( '400', 'Invalid uid' );
		}
		$layoutManager = new Brizy_Admin_Layouts_Manager();
		$layout        = $layoutManager->getEntity( $this->param( 'uid' ) );

		do_action( 'brizy_layout_delete', $this->param( 'uid' ) );

		if ( $layout ) {
			do_action( 'brizy_layout_deleted', $layout );
			do_action( 'brizy_global_data_deleted' );

			$layoutManager->deleteEntity( $layout );
			$this->success( null );
		}

		$this->error( '404', 'Layout not found' );
	}

//	/**
//	 * @param $uid
//	 * @param $postType
//	 *
//	 * @return string|null
//	 */
//	private function getLayoutIdByUid( $uid ) {
//		global $wpdb;
//
//		$prepare = $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} p
//								JOIN {$wpdb->postmeta} pm  ON
//								pm.post_id=p.ID and
//								meta_key='brizy_post_uid' and
//								meta_value='%s'
//								ORDER BY p.ID DESC
//								LIMIT 1", array( $uid, ) );
//
//		return $wpdb->get_var( $prepare );
//	}
//
//	/**
//	 * @param $id
//	 * @param $postType
//	 *
//	 * @return Brizy_Editor_Layout|null
//	 * @throws Brizy_Editor_Exceptions_NotFound
//	 */
//	private function getLayout( $uid ) {
//
//		$postId = $this->getLayoutIdByUid( $uid );
//
//		if ( $postId ) {
//			return Brizy_Editor_Layout::get( $postId );
//		}
//
//		return null;
//
//	}
//
//	/**
//	 * @param $uid
//	 * @param $status
//	 * @param $type
//	 *
//	 * @return Brizy_Editor_Layout|null
//	 * @throws Brizy_Editor_Exceptions_NotFound
//	 */
//	private function createLayout( $uid, $status, $type ) {
//		$name = md5( time() );
//		$post = wp_insert_post( array(
//			'post_title'  => $name,
//			'post_name'   => $name,
//			'post_status' => $status,
//			'post_type'   => $type
//		) );
//
//		if ( $post ) {
//			$brizyPost = Brizy_Editor_Layout::get( $post, $uid );
//			$brizyPost->set_uses_editor( true );
//			$brizyPost->set_needs_compile( true );
//			$brizyPost->setDataVersion( 1 );
//
//			return $brizyPost;
//		}
//
//		throw new Exception( 'Unable to create layout' );
//	}
//
//
//	/***
//	 * @param $postUid
//	 *
//	 * @return false|WP_Post|null
//	 */
//	private function deleteLayout( $postUid ) {
//
//		$postId = $this->getLayoutIdByUid( $postUid );
//
//		return wp_delete_post( $postId );
//	}


}
