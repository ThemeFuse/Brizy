<?php

class  Brizy_Editor_Asset_Optimize_ShortpixelOptimizer implements Brizy_Editor_Asset_Optimize_OptimizerInterface {

	const ID = 'shortpixel';

	/**
	 * @var string
	 */
	private $apiKey;

	/**
	 * @var int
	 */
	private $lossy = 1;

	/**
	 * Brizy_Editor_Asset_Optimize_ShortpixelOptimizer constructor.
	 *
	 * @param $settings
	 *
	 * @throws Exception
	 */
	public function __construct( $settings ) {

		if ( ! isset( $settings['API_KEY'] ) ) {
			throw new Exception( 'Invalid Shortpixel config' );
		}
		$this->apiKey = $settings['API_KEY'];
		$this->lossy  = isset( $settings['lossy'] ) ? (int) $settings['lossy'] : 1;
	}

	public function validateConfig() {

		if ( $this->apiKey == '' || is_null( $this->apiKey ) ) {
			return false;
		}

		$logo_path = str_replace( '/', DIRECTORY_SEPARATOR, BRIZY_PLUGIN_PATH . "/admin/static/img/" );
		$source    = $logo_path . "brizy.png";

		$urlBuilder = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get() );
		$target     = $urlBuilder->brizy_upload_path( "optimized-brizy.png" );

		$result = $this->optimize( $source, $target );

		@unlink( $target );

		return $result;
	}

	/**
	 * @param $sourcePath
	 * @param $targetPath
	 *
	 * @return mixed
	 */
	public function optimize( $sourcePath, $targetPath ) {

		if ( $this->apiKey == '' || is_null( $this->apiKey ) ) {
			return false;
		}

		ShortPixel\setKey( $this->apiKey );
		$result = ShortPixel\fromFile( $sourcePath )->optimize( $this->lossy )->wait( 100 )->toFiles( dirname( $targetPath ) );

		if ( count( $result->succeeded ) == 1 ) {
			return true;
		}

		return false;
	}

	/**
	 * @return string
	 */
	public static function getId() {
		return self::ID;
	}
}