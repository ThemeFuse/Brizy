<?php defined( 'ABSPATH' ) or die();

class Brizy_Import_Import {

	private $demoId;
	private $provider;
	private $extractor;

	public function __construct( $demoId ) {
		$this->demoId    = $demoId;
		$this->provider  = new Brizy_Import_Providers_Multisite();
		$this->extractor = new Brizy_Import_Extractors_Xml( $this->provider->getExportUrl( $this->demoId, $this->getKey() ) );
	}

	/**
	 * @throws Exception
	 */
	public function import() {
		$parser = new Brizy_Import_Parsers_Parser( $this->extractor->getFilePath() );
		$data   = $parser->parse();

		if ( ! empty( $data['importSettings']['plugins'] ) ) {
			$plugins = new Brizy_Import_Plugins( $data['plugins'] );
			$plugins->install();
		}

		$importer = new Brizy_Import_Importers_WordpressImporter( $data );
		die();
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

	public function cleanup() {
		$this->extractor->cleanup();
	}
}
