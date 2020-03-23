<?php


class Brizy_Public_BlockScreenshotProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT = '_block_screenshot';
	const ENDPOINT_POST = '_post';

	/**
	 * @return string
	 */
	protected function get_endpoint_keys() {
		return array( Brizy_Editor::prefix( self::ENDPOINT), Brizy_Editor::prefix( self::ENDPOINT_POST) );
	}

	public function process_query() {
		global $wp_query;
		$vars = $wp_query->query_vars;

		// Check if user is not querying API
		$endpoint = Brizy_Editor::prefix( self::ENDPOINT );
		$endpointPost = Brizy_Editor::prefix( self::ENDPOINT_POST );
		if ( ! isset( $vars[ $endpoint ] ) || ! is_string( $vars[ $endpoint ] ) ) {
			return;
		}

		session_write_close();

		$blockName = $vars[ $endpoint ];
		$blockPost = isset( $vars[ $endpointPost ] ) ? $vars[ $endpointPost ] : null;

		$types = array( 'normal', 'global', 'saved' );

		$noCacheHeaders = array(
			'Cache-Control' => 'max-age=600'
		);

		foreach ( $types as $type ) {
			$filePath = $this->getBlockScreenshotPath( $blockName, $type, $blockPost );
			if ( file_exists( $filePath ) ) {
				$this->send_file( $filePath, $noCacheHeaders );

				return;
			}
		}

		return;
	}

	/**
	 * @param $blockName
	 * @param $blockType
	 * @param $blockPost
	 *
	 * @return null
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	private function getBlockScreenshotPath( $blockName, $blockType, $blockPost ) {
		$folderPath = null;

		switch ( $blockType ) {
			case Brizy_Editor_BlockScreenshotApi::BLOCK_TYPE_NORMAL:
				$brizyPost = Brizy_Editor_Post::get( $blockPost );
				$this->urlBuilder->set_post_id( $brizyPost->getWpPostParentId() );
				$folderPath = $this->urlBuilder->page_upload_path( 'blockThumbnails' );
				break;
			case Brizy_Editor_BlockScreenshotApi::BLOCK_TYPE_GLOBAL:
				$folderPath = $this->urlBuilder->brizy_upload_path( 'blockThumbnails' . DIRECTORY_SEPARATOR . 'global' );
				break;
			case Brizy_Editor_BlockScreenshotApi::BLOCK_TYPE_SAVED:
				$folderPath = $this->urlBuilder->brizy_upload_path( 'blockThumbnails' . DIRECTORY_SEPARATOR . 'saved' );
				break;
			default:
				return null;
		}

		return $folderPath . DIRECTORY_SEPARATOR . "{$blockName}.jpeg";
	}

}
