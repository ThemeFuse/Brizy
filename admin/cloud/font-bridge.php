<?php

/**
 * Class Brizy_Admin_Cloud_FontBridge
 */
class Brizy_Admin_Cloud_FontBridge extends Brizy_Admin_Cloud_AbstractBridge {

	/**
	 * @var Brizy_Admin_Fonts_Manager
	 */
	private $fontManager;

	/**
	 * Brizy_Admin_Cloud_FontBridge constructor.
	 *
	 * @param Brizy_Admin_Cloud_Client $client
	 */
	public function __construct( Brizy_Admin_Cloud_Client $client ) {
		parent::__construct( $client );

		$this->fontManager = new Brizy_Admin_Fonts_Manager();
	}

	/**
	 * @param $fontUid
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function export( $fontUid ) {

		$fontData = $this->fontManager->getFontForExport( $fontUid );

		if ( ! $fontData ) {
			throw new \Exception( "Unable to find font {$fontUid}" );
		}

		try {
			$this->client->createFont( $fontData );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->critical( $e->getMessage(), [ 'exceptionTrace' => $e->getTraceAsString() ] );
		}
	}

	/**
	 * @param $fontUid
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function import( $fontUid ) {
		throw new Exception( 'Not implemented' );
	}

	/**
	 * @param $fontUid
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function delete( $fontUid ) {
		throw new Exception( 'Not implemented' );
	}
}