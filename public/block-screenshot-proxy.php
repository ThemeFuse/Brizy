<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/19/18
 * Time: 3:48 PM
 */

class Brizy_Public_BlockScreenshotProxy extends Brizy_Public_AbstractProxy {

	const ENDPOINT = 'brizy_block_screenshot';
	const ENDPOINT_POST = 'brizy_post';
	const ENDPOINT_BLOCK_TYPE = 'brizy_block_type';

	/**
	 * @return string
	 */
	protected function get_endpoint_keys() {
		return array( self::ENDPOINT, self::ENDPOINT_POST, self::ENDPOINT_BLOCK_TYPE );
	}

	public function process_query() {
		global $wp_query;
		$vars = $wp_query->query_vars;

		// Check if user is not querying API
		if ( ! isset( $vars[ self::ENDPOINT ] ) || ! is_string( $vars[ self::ENDPOINT ] ) ) {
			return;
		}

		// Check if user is not querying API
		if ( ! isset( $vars[ self::ENDPOINT_BLOCK_TYPE ] ) || ! is_string( $vars[ self::ENDPOINT_BLOCK_TYPE ] ) ) {
			return;
		}

		// Check if user is not querying API
		if ( $vars[ self::ENDPOINT_BLOCK_TYPE ] == 'normal' ) {
			if(! isset( $vars[ self::ENDPOINT_POST ] ) || ! is_numeric( $vars[ self::ENDPOINT_POST ] ))
				return;
		}

		$blockName = $vars[ self::ENDPOINT ];
		$blockType = $vars[ self::ENDPOINT_BLOCK_TYPE ];
		$blockPost = isset($vars[ self::ENDPOINT_POST ])?$vars[ self::ENDPOINT_POST ]:null;

		$filePath = $this->getBlockScreenshotPath( $blockName, $blockType, $blockPost );

		$this->send_file($filePath);

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
		$brizyPost = Brizy_Editor_Post::get( $blockPost );
		$this->urlBuilder->set_post( $brizyPost );
		$folderPath = null;

		switch ( $blockType ) {
			default:
			case Brizy_Editor_BlockScreenshotApi::BLOCK_TYPE_NORMAL:
				$folderPath = $this->urlBuilder->page_upload_path( 'blockThumbnails' );
				break;
			case Brizy_Editor_BlockScreenshotApi::BLOCK_TYPE_GLOBAL:
				$folderPath = $this->urlBuilder->brizy_upload_path( 'blockThumbnails' . DIRECTORY_SEPARATOR . 'global' );
				break;
			case Brizy_Editor_BlockScreenshotApi::BLOCK_TYPE_SAVED:
				$folderPath = $this->urlBuilder->brizy_upload_path( 'blockThumbnails' . DIRECTORY_SEPARATOR . 'saved' );
				break;

		}

		$globStr         = $folderPath . DIRECTORY_SEPARATOR . "{$blockName}.*";
		$screenshors = glob( $globStr );

		if ( count( $screenshors ) == 1 ) {
			return $screenshors[0];
		}

		return null;
	}

}