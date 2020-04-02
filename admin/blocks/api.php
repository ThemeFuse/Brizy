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
	const UPDATE_SAVED_BLOCK_ACTION = '-saved-global-block';
	const DELETE_GLOBAL_BLOCK_ACTION = '-delete-global-block';
	const DELETE_SAVED_BLOCK_ACTION = '-delete-saved-block';
	const UPDATE_POSITIONS_ACTION = '-update-block-positions';

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
		add_action( $pref . self::GET_GLOBAL_BLOCKS_ACTION, array( $this, 'actionGetGlobalBlocks' ) );
		add_action( $pref . self::GET_SAVED_BLOCKS_ACTION, array( $this, 'actionGetSavedBlocks' ) );
		add_action( $pref . self::GET_SAVED_BLOCK_ACTION, array( $this, 'actionGetSavedBlockByUid' ) );
		add_action( $pref . self::CREATE_GLOBAL_BLOCK_ACTION, array( $this, 'actionCreateGlobalBlock' ) );
		add_action( $pref . self::UPDATE_GLOBAL_BLOCK_ACTION, array( $this, 'actionUpdateGlobalBlock' ) );
		add_action( $pref . self::UPDATE_SAVED_BLOCK_ACTION, array( $this, 'actionUpdateSavedBlock' ) );
		add_action( $pref . self::DELETE_GLOBAL_BLOCK_ACTION, array( $this, 'actionDeleteGlobalBlock' ) );
		add_action( $pref . self::CREATE_SAVED_BLOCK_ACTION, array( $this, 'actionCreateSavedBlock' ) );
		add_action( $pref . self::DELETE_SAVED_BLOCK_ACTION, array( $this, 'actionDeleteSavedBlock' ) );
		add_action( $pref . self::UPDATE_POSITIONS_ACTION, array( $this, 'actionUpdateBlockPositions' ) );
	}

	public function actionGetGlobalBlocks() {
		$this->verifyNonce( self::nonce );

		try {
			$bockManager = new Brizy_Admin_Blocks_Manager( null );

			$fields = $this->param( 'fields' ) ? $this->param( 'fields' ) : [];

			$blocks = $bockManager->getAllBlocks( Brizy_Admin_Blocks_Main::CP_GLOBAL, array(), $fields );

			$this->success( $blocks );

		} catch ( Exception $exception ) {
			$this->error( 400, $exception->getMessage() );
		}
	}

	public function actionGetSavedBlocks() {
		$this->verifyNonce( self::nonce );

		try {
			$cloudClient = new Brizy_Admin_Cloud_Client( Brizy_Editor_Project::get(), new WP_Http() );

			$fields = $this->param( 'fields' ) ? $this->param( 'fields' ) : [];

			$bockManager = new Brizy_Admin_Blocks_Manager( $cloudClient );

			$blocks = $bockManager->getAllBlocks( Brizy_Admin_Blocks_Main::CP_SAVED, array(), $fields );

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

		try {
			$cloudClient = new Brizy_Admin_Cloud_Client( Brizy_Editor_Project::get(), new WP_Http() );
			$bockManager = new Brizy_Admin_Blocks_Manager( $cloudClient );

			$block = $bockManager->getBlockByUid( Brizy_Admin_Blocks_Main::CP_SAVED, $this->param( 'uid' ) );

			if ( ! $block ) {
				$this->error( 404, 'Block not found' );
			}

			$this->success( $block );

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
				$this->error( 400, "Invalid post type" );
			}

			$block = $this->createBlock( $this->param( 'uid' ), $status, Brizy_Admin_Blocks_Main::CP_GLOBAL );
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
			$data  = stripslashes( $this->param( 'data' ) );
			$block = $this->createBlock( $this->param( 'uid' ), 'publish', Brizy_Admin_Blocks_Main::CP_SAVED );
			$block->setMedia( stripslashes( $this->param( 'media' ) ) );
			$block->setMeta( stripslashes( $this->param( 'meta' ) ) );
			$block->set_editor_data( $data );
			$block->set_needs_compile( true );
			$block->setCloudUpdateRequired( true );
			$block->save();

			do_action( 'brizy_saved_block_created', $block );
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

			if ( $this->param( 'dataVersion' ) === null ) {
				$this->error( '400', 'Invalid data version' );
			}

			$status = stripslashes( $this->param( 'status' ) );

			if ( ! in_array( $status, [ 'publish', 'draft' ] ) ) {
				$this->error( 400, "Invalid post type" );
			}


			$block = $this->getBlock( $this->param( 'uid' ), Brizy_Admin_Blocks_Main::CP_GLOBAL );
			/**
			 * @var Brizy_Editor_Block $block ;
			 */
			$block->setMeta( stripslashes( $this->param( 'meta' ) ) );
			$block->set_editor_data( stripslashes( $this->param( 'data' ) ) );

			if ( (int) $this->param( 'is_autosave' ) ) {
				$block->save( 1 );
			} else {

				$block->setDataVersion( $this->param( 'dataVersion' ) );
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

			$block = $this->getBlock( $this->param( 'uid' ), Brizy_Admin_Blocks_Main::CP_SAVED );

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
				do_action( 'brizy_saved_data_updated' );
			}

			Brizy_Editor_Block::cleanClassCache();

			$this->success( Brizy_Editor_Block::get( $block->getWpPostId() )->createResponse() );
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
			$this->deleteBlock( $this->param( 'uid' ), Brizy_Admin_Blocks_Main::CP_GLOBAL );
			$this->success( null );
		}

		$this->error( '404', 'Block not found' );
	}

	public function actionDeleteSavedBlock() {
		$this->verifyNonce( self::nonce );

		if ( ! $this->param( 'uid' ) ) {
			$this->error( '400', 'Invalid uid' );
		}

		$block = $this->getBlock( $this->param( 'uid' ), Brizy_Admin_Blocks_Main::CP_SAVED );

		if ( $block ) {
			do_action( 'brizy_global_block_deleted', $block );
			do_action( 'brizy_global_data_deleted' );
			$this->deleteBlock( $this->param( 'uid' ), Brizy_Admin_Blocks_Main::CP_SAVED );
			$this->success( null );
		}
		$this->error( '404', 'Block not found' );
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

				$block = $this->getBlock( $uid, Brizy_Admin_Blocks_Main::CP_GLOBAL );

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
								LIMIT 1", array( $uid, $postType ) );

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
			'post_type'   => $type
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
	private function deleteBlock( $postUid, $postType ) {

		$postId = $this->getBlockIdByUidAndBlockType( $postUid, $postType );

		if ( $postId ) {
			return wp_delete_post( $postId );
		}
	}
}
