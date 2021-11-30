<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/4/19
 * Time: 3:51 PM
 */

class  Brizy_Editor_Asset_Crop_ExternalService implements Brizy_Editor_Asset_Crop_ServiceInterface {


	/**
	 * @var string
	 */
	private $targetPath;

	/**
	 * Brizy_Editor_Asset_Crop_WordpressService constructor.
	 *
	 * @param $sourcePath
	 * @param $targetPath
	 *
	 * @throws Exception
	 */
	public function __construct( $sourcePath, $targetPath ) {

		if ( ! file_exists( $sourcePath ) ) {
			throw new Exception( 'Unable to crop media. Source file not found.' );
		}

		$this->targetPath = $targetPath;
	}

	/**
	 * @param int $offsetX
	 * @param int $offsetY
	 * @param int $width
	 * @param int $height
	 *
	 * @throws Exception
	 */
	public function crop( $offsetX, $offsetY, $width, $height ) {
		throw new Exception( 'Not implemented' );
	}

	/**
	 * @param int $width
	 * @param int $height
	 *
	 * @throws Exception
	 */
	public function resize( $width, $height ) {
		throw new Exception( 'Not implemented' );
	}


	/**
	 * @throws Exception
	 */
	public function saveTargetImage() {
		throw new Exception( 'Not implemented' );
	}

	public function getSize() {
		throw new Exception( 'Not implemented' );
	}
}