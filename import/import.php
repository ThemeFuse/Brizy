<?php defined( 'ABSPATH' ) or die();

class Brizy_Import_Import {

	private $demoId;

	public function __construct( $demoId ) {
		$this->demoId = $demoId;
	}

	/**
	 * @throws Exception
	 */
	public function import() {

		$provider  = new Brizy_Import_Providers_Multisite();
		$extractor = new Brizy_Import_Extractors_Xml( $provider->getDemoUrl( $this->demoId, $this->getKey() ) );
		$xmlPath   = $extractor->getFilePath();

		$extractor->cleanup();

		$parser = new Brizy_Import_Parsers_Parser( $xmlPath );
		$data   = $parser->parse();

		if ( ! empty( $data['plugins'] ) ) {
			$plugins = new Brizy_Import_Plugins( $data['plugins'] );
			$plugins->install();
		}

		$importer = new Brizy_Import_Importers_WordpressImporter( $data );
		$importer->import();
	}

	private function getKey() {
		$key = '';

		if ( Brizy_Compatibilities_BrizyProCompatibility::isPro() ) {
			$licenseData = BrizyPro_Admin_License::_init()->getCurrentLicense();
			if ( ! empty( $licenseData['key'] ) ) {
				$key = $licenseData['key'];
			}
		}

		return $key;
	}
}
