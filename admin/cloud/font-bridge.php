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
	public function __construct(  $client ) {
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

		if ( ! $this->client->getFont( $fontUid ) ) {
			$this->client->createFont( $fontData );
		}
	}

	/**
	 * @param $fontUid
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	public function import( $fontUid ) {

		if ( $font = $this->fontManager->getFont( $fontUid ) ) {
			return $font;
		}

		$font = $this->client->getFont( $fontUid );

		$family  = $font['family'];
		$weights = $font['files'];

		$newWeights = array();

		foreach ( $weights as $weight => $weightType ) {
			foreach ( $weightType as $type => $fileUrl ) {
				$newWeights[ $weight ][ $type ] = $this->downloadFileToTemporaryFile( $fileUrl );
			}
		}

		return $this->fontManager->createFont( $fontUid, $family, $newWeights, 'uploaded' );
	}

	private function downloadFileToTemporaryFile( $url ) {
		$filePath = tempnam( sys_get_temp_dir(), basename( $url ) );
		$content  = Brizy_Editor_Asset_StaticFile::get_asset_content( $url );
		$result   = file_put_contents( $filePath, $content );

		if ( $result === false ) {
			Brizy_Logger::instance()->critical( 'Filed to write font content',
				[
					'url'      => $url,
					'filePath' => $filePath
				] );
			throw new Exception( 'Filed to write font content' );
		}

		return array(
			'name'     => basename( $url ),
			'type'     => Brizy_Public_AssetProxy::get_mime( $filePath ),
			'tmp_name' => $filePath,
			'error'    => 0,
			'size'     => filesize( $filePath )
		);
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
