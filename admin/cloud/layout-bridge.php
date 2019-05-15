<?php

/**
 * Class Brizy_Admin_Cloud_BlockUploader
 */
class Brizy_Admin_Cloud_LayoutBridge extends Brizy_Admin_Cloud_AbstractBridge {


	/**
	 * @param Brizy_Editor_Block $layout
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function export( $layout ) {

		// check if the assets are uploaded in cloud
		// upload them if needed
		// create the block in cloud

		$media = json_decode( $layout->getMedia() );

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

		$this->client->createOrUpdateLayout( $layout );
	}

	/**
	 * @param $layoutId
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function import( $layoutId ) {
		$layouts = $this->client->getLayouts( [ 'filter' => [ 'uid' => $layoutId ] ] );

		if ( ! isset( $layouts[0] ) ) {
			return;
		}

		$layout = $layouts[0];

		$name = md5( time() );
		$post = wp_insert_post( array(
			'post_title'  => $name,
			'post_name'   => $name,
			'post_status' => 'publish',
			'post_type'   => Brizy_Admin_Layouts_Main::CP_LAYOUT
		) );

		if ( $post ) {
			$brizyPost = Brizy_Editor_Layout::get( $post, $layout['uid'] );
			$brizyPost->setMeta( $layout['meta'] );
			$brizyPost->setCloudId( $layout['id'] );
			$brizyPost->set_editor_data( $layout['data'] );
			$brizyPost->set_uses_editor( true );
			$brizyPost->set_needs_compile( true );
			$brizyPost->saveStorage();
		}
	}

	/**
	 * @param Brizy_Editor_Block $layout
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function delete( $layout ) {
		$this->client->deleteLayout( $layout->getCloudId() );
	}
}