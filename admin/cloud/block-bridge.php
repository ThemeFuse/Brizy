<?php

/**
 * Class Brizy_Admin_Cloud_BlockUploader
 */
class Brizy_Admin_Cloud_BlockBridge extends Brizy_Admin_Cloud_AbstractBridge {

	use Brizy_Editor_Asset_AttachmentAware;

	/**
	 * @param Brizy_Editor_Block $block
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function export( $block ) {

		// check if the assets are uploaded in cloud
		// upload them if needed
		// create the block in cloud

		$media = json_decode( $block->getMedia() );

		if ( ! $media || ! isset( $media->fonts ) ) {
			throw new Exception( 'No fonts property in media object' );
		}

		if ( ! $media || ! isset( $media->images ) ) {
			throw new Exception( 'No images property in media object' );
		}

		$bridge = new Brizy_Admin_Cloud_MediaBridge( $this->client );
		foreach ( $media->images as $uid ) {
			$bridge->export( $uid );
		}

		$bridge = new Brizy_Admin_Cloud_FontBridge( $this->client );
		foreach ( $media->fonts as $fontUid ) {
			$bridge->export( $fontUid );
		}

		$bridge = new Brizy_Admin_Cloud_ScreenshotBridge( $this->client );
		$bridge->export( $block );

		$cloudBlockObject = $this->client->createOrUpdateBlock( $block );

		$block->setSynchronized( Brizy_Editor_Project::get()->getCloudAccountId(), $cloudBlockObject->uid );

		$block->saveStorage();
	}

	/**
	 * @param $blockId
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function import( $blockId ) {
		$blocks = $this->client->getBlocks( [ 'uid' => $blockId ] );

		if ( ! isset( $blocks[0] ) ) {
			return;
		}

		$block = (array) $blocks[0];

		$name = md5( time() );
		$post = wp_insert_post( array(
			'post_title'  => $name,
			'post_name'   => $name,
			'post_status' => 'publish',
			'post_type'   => Brizy_Admin_Blocks_Main::CP_SAVED
		) );

		if ( $post ) {
			$brizyPost = Brizy_Editor_Block::get( $post, $block['uid'] );
			$brizyPost->setMeta( $block['meta'] );
			$brizyPost->set_editor_data( $block['data'] );
			$brizyPost->set_uses_editor( true );
			$brizyPost->set_needs_compile( true );
			$brizyPost->setDataVersion( 1 );
			$brizyPost->setSynchronized( $this->client->getBrizyProject()->getCloudAccountId(), $block['id'] );
			$brizyPost->save();

			$bridge = new Brizy_Admin_Cloud_ScreenshotBridge( $this->client );
			$bridge->import( $brizyPost );
		}
	}

	/**
	 * @param Brizy_Editor_Block $layout
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function delete( $layout ) {
		$this->client->deleteBlock( $layout->getCloudId() );
	}
}
