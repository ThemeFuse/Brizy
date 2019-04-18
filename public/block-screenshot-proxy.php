<?php


class Brizy_Public_BlockScreenshotProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT = 'brizy_block_screenshot';
	const ENDPOINT_POST = 'brizy_post';

	/**
	 * @return string
	 */
	protected function get_endpoint_keys() {
		return array( self::ENDPOINT, self::ENDPOINT_POST );
	}

	public function process_query() {
		global $wp_query;
		$vars = $wp_query->query_vars;

		// Check if user is not querying API
		if ( ! isset( $vars[ self::ENDPOINT ] ) || ! is_string( $vars[ self::ENDPOINT ] ) ) {
			return;
		}

		session_write_close();

		$blockName = $vars[ self::ENDPOINT ];
		$blockPost = isset( $vars[ self::ENDPOINT_POST ] ) ? $vars[ self::ENDPOINT_POST ] : null;

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
				$this->urlBuilder->set_post_id( $brizyPost->get_parent_id() );
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

		$globStr     = $folderPath . DIRECTORY_SEPARATOR . "{$blockName}.*";
		$screenshots = glob( $globStr );

		if ( count( $screenshots ) == 1 ) {
			return $screenshots[0];
		}

		return null;
	}

}