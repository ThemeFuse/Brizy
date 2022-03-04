<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/18/18
 * Time: 10:48 AM
 */


class Brizy_Admin_Blocks_Api extends Brizy_Admin_AbstractApi {

	const nonce = 'brizy-api';

	const GET_SAVED_BLOCK_ACTION = '-get-saved-block';
	const GET_GLOBAL_BLOCKS_ACTION = '-get-global-blocks';
	const GET_SAVED_BLOCKS_ACTION = '-get-saved-blocks';
	const CREATE_GLOBAL_BLOCK_ACTION = '-create-global-block';
	const CREATE_SAVED_BLOCK_ACTION = '-create-saved-block';
	const UPDATE_GLOBAL_BLOCK_ACTION = '-update-global-block';
	const UPDATE_GLOBAL_BLOCKS_ACTION = '-update-global-blocks';
	const UPDATE_SAVED_BLOCK_ACTION = '-saved-global-block';
	const DELETE_GLOBAL_BLOCK_ACTION = '-delete-global-block';
	const DELETE_SAVED_BLOCK_ACTION = '-delete-saved-block';
	const UPDATE_POSITIONS_ACTION = '-update-block-positions';
	const DOWNLOAD_BLOCKS = '-download-blocks';
	const UPLOAD_BLOCKS = '-upload-blocks';

	/**
	 * @var Brizy_Admin_Rules_Manager
	 */
	private $ruleManager;

	/**
	 * @return Brizy_Admin_Blocks_Api
	 */
	public static function _init() {
		static $instance;

		if ( ! $instance ) {
			$instance = new self( new Brizy_Admin_Rules_Manager() );
		}

		return $instance;
	}

	/**
	 * Brizy_Admin_Blocks_Api constructor.
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
		$pref = 'wp_ajax_' . Brizy_Editor::prefix();
		add_action( $pref . self::DOWNLOAD_BLOCKS, array( $this, 'actionDownloadBlocks' ) );
		add_action( $pref . self::UPLOAD_BLOCKS, array( $this, 'actionUploadBlocks' ) );
		add_action( $pref . self::GET_GLOBAL_BLOCKS_ACTION, array( $this, 'actionGetGlobalBlocks' ) );
		add_action( $pref . self::CREATE_GLOBAL_BLOCK_ACTION, array( $this, 'actionCreateGlobalBlock' ) );
		add_action( $pref . self::UPDATE_GLOBAL_BLOCK_ACTION, array( $this, 'actionUpdateGlobalBlock' ) );
		add_action( $pref . self::UPDATE_GLOBAL_BLOCKS_ACTION, array( $this, 'actionUpdateGlobalBlocks' ) );
		add_action( $pref . self::DELETE_GLOBAL_BLOCK_ACTION, array( $this, 'actionDeleteGlobalBlock' ) );

		add_action( $pref . self::GET_SAVED_BLOCKS_ACTION, array( $this, 'actionGetSavedBlocks' ) );
		add_action( $pref . self::GET_SAVED_BLOCK_ACTION, array( $this, 'actionGetSavedBlockByUid' ) );
		add_action( $pref . self::UPDATE_SAVED_BLOCK_ACTION, array( $this, 'actionUpdateSavedBlock' ) );
		add_action( $pref . self::CREATE_SAVED_BLOCK_ACTION, array( $this, 'actionCreateSavedBlock' ) );
		add_action( $pref . self::DELETE_SAVED_BLOCK_ACTION, array( $this, 'actionDeleteSavedBlock' ) );
		add_action( $pref . self::UPDATE_POSITIONS_ACTION, array( $this, 'actionUpdateBlockPositions' ) );
	}

	public function actionDownloadBlocks() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'uid' ) ) {
			$this->error( 400, 'Invalid block uid param' );
		}
		try {
			$bockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_SAVED );
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
				$this->error( 404, __( 'There are no block to be archived' ) );
			}

			$fontManager = new Brizy_Admin_Fonts_Manager();
			$zip         = new Brizy_Editor_Zip_Archiver( Brizy_Editor_Project::get(), $fontManager, BRIZY_EDITOR_VERSION );

			switch ( $this->param( 'type' ) ) {
				case 'popup':
					$zipPath = "Popup-" . date( DATE_ATOM ) . ".zip";
					break;
				default:
					$zipPath = "Block-" . date( DATE_ATOM ) . ".zip";
					break;
			}

			$zipPath = $zip->createZip( $items, $zipPath );

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
			$this->error( 400, __( $exception->getMessage(), 'brizy' ) );
		}
	}

	public function actionUploadBlocks() {
		try {
			$this->verifyNonce( self::nonce );

			if ( ! isset( $_FILES['files'] ) ) {
				$this->error( 400, __( 'Invalid block file' ) );
			}

			$fields = $this->param( 'fields' ) ? $this->param( 'fields' ) : [];

			if ( ! function_exists( 'wp_handle_upload' ) ) {
				require_once( ABSPATH . 'wp-admin/includes/file.php' );
			}

			$file         = [
				'name'     => $_FILES['files']['name'][0],
				'type'     => $_FILES['files']['type'][0],
				'tmp_name' => $_FILES['files']['tmp_name'][0],
				'error'    => $_FILES['files']['error'][0],
				'size'     => $_FILES['files']['size'][0],
			];
			$uploadedFile = wp_handle_upload( $file, [ 'test_form' => false ] );

			if ( isset( $uploadedFile['file'] ) ) {
				$zip = new Brizy_Editor_Zip_Archiver( Brizy_Editor_Project::get(),
					new Brizy_Admin_Fonts_Manager(),
					BRIZY_EDITOR_VERSION );
				list( $instances, $errors ) = $zip->createFromZip( $uploadedFile['file'] );
				unset( $uploadedFile['file'] );
				$bockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_SAVED );
				$this->success( [
					'success' => $bockManager->createResponseForEntities( $instances, $fields ),
					'errors'  => $errors
				] );
			} else {
				if ( isset( $uploadedFile['error'] ) ) {
					$this->error( 400, $uploadedFile['error'] );
				} else {
					$this->error( 400, __( "Invalid zip file provided" ) );
				}
			}

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionGetGlobalBlocks() {
		$this->verifyNonce( self::nonce );

		try {
			$fields      = $this->param( 'fields' ) ? $this->param( 'fields' ) : [];
			$bockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
			$blocks      = $bockManager->getEntities( [ 'post_status' => 'any' ] );
			$this->success( $bockManager->createResponseForEntities( $blocks, $fields ) );
		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionCreateGlobalBlock() {
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
			$position   = stripslashes( $this->param( 'position' ) );
			$status     = stripslashes( $this->param( 'status' ) );
			$rulesData  = stripslashes( $this->param( 'rules' ) );

			if ( ! in_array( $status, [ 'publish', 'draft' ] ) ) {
				$this->error( 400, "Invalid status" );
			}

			$bockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
			$block       = $bockManager->createEntity( $this->param( 'uid' ), $status );
			$block->setMeta( stripslashes( $this->param( 'meta' ) ) );
			$block->set_editor_data( $editorData );
			$block->set_needs_compile( true );

			if ( $position ) {
				$block->setPosition( Brizy_Editor_BlockPosition::createFromSerializedData( get_object_vars( json_decode( $position ) ) ) );
			}

			// rules
			if ( $rulesData ) {
				$rules = $this->ruleManager->createRulesFromJson( $rulesData, Brizy_Admin_Blocks_Main::CP_GLOBAL );
				$this->ruleManager->addRules( $block->getWpPostId(), $rules );
			}

			$block->save();

			do_action( 'brizy_global_block_created', $block );
			do_action( 'brizy_global_data_updated' );

			$this->success( $block->createResponse() );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionUpdateGlobalBlock() {
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

			$status = stripslashes( $this->param( 'status' ) );

			if ( ! in_array( $status, [ 'publish', 'draft' ] ) ) {
				$this->error( 400, "Invalid post type" );
			}

			$bockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
			$block       = $bockManager->getEntity( $this->param( 'uid' ) );

			if ( ! $block ) {
				$this->error( 400, "Global block not found" );
			}
			/**
			 * @var Brizy_Editor_Block $block ;
			 */
			$block->setMeta( stripslashes( $this->param( 'meta' ) ) );
			$block->set_editor_data( stripslashes( $this->param( 'data' ) ) );

			if ( (int) $this->param( 'is_autosave' ) ) {
				$block->save( 1 );
			} else {
				// issue: #14271
				//$block->setDataVersion( $this->param( 'dataVersion' ) );
				$block->getWpPost()->post_status = $status;

				// position
				$position = stripslashes( $this->param( 'position' ) );
				if ( $position ) {
					$block->setPosition( Brizy_Editor_BlockPosition::createFromSerializedData( get_object_vars( json_decode( $position ) ) ) );
				}

				// rules
				$rulesData = stripslashes( $this->param( 'rules' ) );
				if ( $rulesData ) {
					$rules = $this->ruleManager->createRulesFromJson( $rulesData, Brizy_Admin_Blocks_Main::CP_GLOBAL );
					$this->ruleManager->setRules( $block->getWpPostId(), $rules );
				}

				$block->save( 0 );

				do_action( 'brizy_global_block_updated', $block );
				do_action( 'brizy_global_data_updated' );
			}

			Brizy_Editor_Block::cleanClassCache();

			$this->success( Brizy_Editor_Block::get( $block->getWpPostId() )->createResponse() );
		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionUpdateGlobalBlocks() {
		//$this->verifyNonce( self::nonce );
		try {

			if ( ! $this->param( 'uid' ) ) {
				$this->success( [] );
			}

			foreach ( (array) $this->param( 'uid' ) as $i => $uid ) {

				if ( ! $this->param( 'uid' )[ $i ] ) {
					$this->error( '400', 'Invalid uid' );
				}

//				if ( ! $this->param( 'data' )[ $i ] ) {
//					$this->error( '400', 'Invalid data' );
//				}

				if ( ! $this->param( 'meta' )[ $i ] ) {
					$this->error( 400, 'Invalid meta data' );
				}

				$status = stripslashes( $this->param( 'status' )[ $i ] );

				if ( ! in_array( $status, [ 'publish', 'draft' ] ) ) {
					$this->error( 400, "Invalid post type" );
				}
			}

			$bockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );
			$blocks      = $bockManager->getEntity( (array) $this->param( 'uid' ) );

			foreach ( (array) $this->param( 'uid' ) as $i => $uid ) {

				if ( ! isset( $blocks[ $uid ] ) ) {
					$this->error( 400, "Global block not found" );
				}

				/**
				 * @var Brizy_Editor_Block $block ;
				 */
				$status = stripslashes( $this->param( 'status' )[ $i ] );
				$block  = $blocks[ $uid ];

				$block->setMeta( stripslashes( $this->param( 'meta' )[ $i ] ) );

				if ( isset( $this->param( 'data' )[ $i ] ) && ! empty( $this->param( 'data' )[ $i ] ) ) {
					$block->set_editor_data( stripslashes( $this->param( 'data' )[ $i ] ) );
				}

				if ( isset( $this->param( 'is_autosave' )[ $i ] ) && (int) $this->param( 'is_autosave' )[ $i ] === 1 ) {
					$block->save( 1 );
				} else {

					// issue: #14271
					//$block->setDataVersion( $this->param( 'dataVersion' )[ $i ] );
					$block->getWpPost()->post_status = $status;

					// position
					$position = stripslashes( $this->param( 'position' )[ $i ] );
					if ( $position && ( $positionObject = json_decode( $position ) ) ) {
						$block->setPosition( Brizy_Editor_BlockPosition::createFromSerializedData( get_object_vars( $positionObject ) ) );
					}

					// rules
					$rulesData = stripslashes( $this->param( 'rules' )[ $i ] );
					if ( $rulesData ) {
						$rules = $this->ruleManager->createRulesFromJson( $rulesData,
							Brizy_Admin_Blocks_Main::CP_GLOBAL );
						$this->ruleManager->setRules( $block->getWpPostId(), $rules );
					}

					$block->save();

					do_action( 'brizy_global_block_updated', $block );
				}
			}

			do_action( 'brizy_global_data_updated' );

			$this->success( [] );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionDeleteGlobalBlock() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'uid' ) ) {
			$this->error( '400', 'Invalid uid' );
		}

		$block = $this->getBlock( $this->param( 'uid' ), Brizy_Admin_Blocks_Main::CP_GLOBAL );

		if ( $block ) {
			do_action( 'brizy_global_block_deleted', $block );
			do_action( 'brizy_global_data_deleted' );
			$this->deleteBlock( $block, Brizy_Admin_Blocks_Main::CP_GLOBAL );
			$this->success( null );
		}

		$this->error( '404', 'Block not found' );
	}

	public function actionGetSavedBlocks() {
		$this->verifyNonce( self::nonce );

		try {
			$fields       = $this->param( 'fields' ) ? $this->param( 'fields' ) : [];
			$bockManager  = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_SAVED );
			$blocks       = $bockManager->getEntities( [
				'paged'          => (int) ( $this->param( 'page' ) ?: 1 ),
				'posts_per_page' => (int) ( $this->param( 'count' ) ?: - 1 ),
				'order'          => $this->param( 'order' ) ?: 'ASC',
				'orderby'        => $this->param( 'orderby' ) ?: 'ID'
			] );
			$blocks       = apply_filters( 'brizy_get_saved_blocks',
				$bockManager->createResponseForEntities( $blocks, $fields ),
				$fields,
				$bockManager );
			$this->success( $blocks );
		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionGetSavedBlockByUid() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'uid' ) ) {
			$this->error( 400, 'Invalid uid' );
		}

		$fields = $this->param( 'fields' ) ? $this->param( 'fields' ) : [];

		try {

			$bockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_SAVED );
			$block       = $bockManager->getEntity( $this->param( 'uid' ) );

			$block = apply_filters( 'brizy_get_saved_block', $block, $this->param( 'uid' ), $bockManager );

			if ( ! $block ) {
				$this->error( 404, 'Block not found' );
			}

			$this->success( $block->createResponse( $fields ) );
		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionCreateSavedBlock() {
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
			$bockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_SAVED );
			$block       = $bockManager->createEntity( $this->param( 'uid' ) );
			$block->setMedia( stripslashes( $this->param( 'media' ) ) );
			$block->setMeta( stripslashes( $this->param( 'meta' ) ) );
			$block->set_editor_data( stripslashes( $this->param( 'data' ) ) );
			$block->set_needs_compile( true );
			//$block->setCloudUpdateRequired( true );
			$block->save();

			do_action( 'brizy_saved_block_created', $block );
			do_action( 'brizy_global_data_updated' );

			$this->success( $block->createResponse() );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionUpdateSavedBlock() {
		$this->verifyNonce( self::nonce );

		try {
			if ( ! $this->param( 'uid' ) ) {
				$this->error( '400', 'Invalid uid' );
			}

			if ( ! $this->param( 'data' ) ) {
				$this->error( '400', 'Invalid data' );
			}

			if ( $this->param( 'dataVersion' ) === null ) {
				$this->error( '400', 'Invalid data version' );
			}

			if ( ! $this->param( 'meta' ) ) {
				$this->error( 400, 'Invalid meta data' );
			}

			if ( ! $this->param( 'media' ) ) {
				$this->error( 400, 'Invalid media data provided' );
			}

			$bockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_SAVED );
			$block       = $bockManager->getEntity( $this->param( 'uid' ) );

			if ( ! $block instanceof Brizy_Editor_Block ) {
				$this->error( '404', 'Block not found' );
			}

			$block->set_editor_data( stripslashes( $this->param( 'data' ) ) );
			$block->setDataVersion( $this->param( 'dataVersion' ) );
			$block->setMedia( stripslashes( $this->param( 'media' ) ) );
			$block->setMeta( stripslashes( $this->param( 'meta' ) ) );

			if ( (int) $this->param( 'is_autosave' ) ) {
				$block->save( 1 );
			} else {
				$block->save();
				do_action( 'brizy_saved_block_updated', $block );
				do_action( 'brizy_global_data_updated' );
			}

			Brizy_Editor_Block::cleanClassCache();

			$this->success( Brizy_Editor_Block::get( $block->getWpPostId() )->createResponse() );
		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionDeleteSavedBlock() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'uid' ) ) {
			$this->error( '400', 'Invalid uid' );
		}

		try {
			$bockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_SAVED );
			$block       = $bockManager->getEntity( $this->param( 'uid' ) );

			do_action( 'brizy_saved_block_delete', $this->param( 'uid' ) );

			if ( $block ) {
				do_action( 'brizy_global_data_deleted' );
				$bockManager->deleteEntity( $block );
			} else {
				$this->error( '404', 'Block not found' );
			}
		} catch ( Exception $e ) {
			$this->error( '500', 'Unable to delete block' );
		}

		$this->success( null );
	}

	public function actionUpdateBlockPositions() {

		global $wpdb;

		$this->verifyNonce( self::nonce );

		$data = file_get_contents( "php://input" );

		$dataObject = json_decode( $data );

		if ( ! $dataObject ) {
			$this->error( 400, 'Invalid position data provided' );
		}

		$wpdb->query( 'START TRANSACTION' );

		try {

			foreach ( get_object_vars( $dataObject ) as $uid => $position ) {

				if ( ! ( isset( $position->top ) && isset( $position->bottom ) && isset( $position->align ) ) ) {
					throw  new Exception();
				}

				$positionObj = new Brizy_Editor_BlockPosition( $position->top, $position->bottom, $position->align );


				$bockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );

				$block = $bockManager->getEntity( $uid );

				if ( ! $block ) {
					throw  new Exception();
				}

				$block->setPosition( $positionObj );

				if ( $this->param( 'is_autosave' ) == 1 ) {
					$block->save( 1 );
				} else {
					$block->saveStorage();
				}

				do_action( 'brizy_global_block_updated', $block );
			}

			do_action( 'brizy_global_data_updated' );

			$wpdb->query( 'COMMIT' );

		} catch ( Exception $e ) {
			$wpdb->query( 'ROLLBACK' );
			$this->error( '400', 'Unable to save block positions' );
		}

		$this->success( json_encode( $dataObject ) );
	}


	/**
	 * @param $uid
	 * @param $postType
	 *
	 * @return string|null
	 */
	private function getBlockIdByUidAndBlockType( $uid, $postType ) {
		global $wpdb;

		$prepare = $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} p 
								JOIN {$wpdb->postmeta} pm  ON 
								pm.post_id=p.ID and 
								meta_key='brizy_post_uid' and 
								meta_value='%s'   
								WHERE p.post_type IN ('%s')
								ORDER BY p.ID DESC
								LIMIT 1",
			array( $uid, $postType ) );

		return $wpdb->get_var( $prepare );
	}

	/**
	 * @param $uid
	 * @param $postType
	 *
	 * @return string|null
	 */
	private function getBlockIdByUid( $uid ) {
		global $wpdb;

		$prepare = $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} p 
								JOIN {$wpdb->postmeta} pm  ON pm.post_id=p.ID and meta_key='brizy_post_uid' and meta_value='%s'
								WHERE p.post_type <> 'attachment'   
								ORDER BY p.ID DESC
								LIMIT 1",
			array( $uid, ) );

		return $wpdb->get_var( $prepare );
	}

	/**
	 * @param $id
	 * @param $postType
	 *
	 * @return Brizy_Editor_Block|null
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	private function getBlock( $id, $postType ) {
		$postId = $this->getBlockIdByUidAndBlockType( $id, $postType );

		if ( $postId ) {
			return Brizy_Editor_Block::get( $postId );
		}

		return null;
	}

	/**
	 * @param $uid
	 * @param $status
	 * @param $type
	 *
	 * @return Brizy_Editor_Block
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	private function createBlock( $uid, $status, $type ) {
		$name = md5( time() );
		$post = wp_insert_post( array(
			'post_title'  => $name,
			'post_name'   => $name,
			'post_status' => $status,
			'post_type'   => $type,
		) );

		if ( $post ) {
			$brizyPost = Brizy_Editor_Block::get( $post, $uid );
			$brizyPost->set_uses_editor( true );
			$brizyPost->set_needs_compile( true );
			$brizyPost->setDataVersion( 1 );

			return $brizyPost;
		}

		throw new Exception( 'Unable to create block' );
	}

	/**
	 * @param $postUid
	 * @param $postType
	 *
	 * @return false|WP_Post|null
	 */
	private function deleteBlock( $block, $postType ) {

		if ( $postType === Brizy_Admin_Blocks_Main::CP_SAVED ) {

		}

		return wp_delete_post( $block->getWpPostId() );
	}
}
