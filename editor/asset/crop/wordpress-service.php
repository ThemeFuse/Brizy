<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/4/19
 * Time: 3:51 PM
 */

class  Brizy_Editor_Asset_Crop_WordpressService implements Brizy_Editor_Asset_Crop_ServiceInterface {

	/**
	 * @var WP_Image_Editor
	 */
	private $imageEditor;

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

		$this->targetPath  = $targetPath;
		$this->imageEditor = wp_get_image_editor( $sourcePath );

		if ( $this->imageEditor instanceof WP_Error ) {
			Brizy_Logger::instance()->error( $this->imageEditor->get_error_message(), array( $this->imageEditor ) );
			throw new Exception( "Unable to obtain the image editor" );
		}
	}

	/**
	 * @param int $offsetX
	 * @param int $offsetY
	 * @param int $width
	 * @param int $height
	 *
	 * @return bool
	 */
	public function crop( $offsetX, $offsetY, $width, $height ) {
		try {
			$this->imageEditor->crop( $offsetX, $offsetY, $width, $height );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );

			return false;
		}

		return true;
	}


	public function getSize() {
		try {
			return $this->imageEditor->get_size();
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );
		}
	}

	/**
	 * @param int $width
	 * @param int $height
	 *
	 * @return bool
	 */
	public function resize( $width, $height ) {

		try {
			$this->imageEditor->resize( $width, $height );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );

			return false;
		}

		return true;
	}

	/**
	 * @throws Exception
	 */
	public function saveTargetImage() {
		$result = $this->imageEditor->save( $this->targetPath );

		if ( $result instanceof WP_Error ) {
			return false;
		}

		return true;
	}

}