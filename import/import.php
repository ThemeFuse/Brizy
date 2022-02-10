<?php defined( 'ABSPATH' ) or die();

class Brizy_Import_Import {

	private $demoId;
	private $provider;
	private $extractor;

	public function __construct( $demoId ) {
		$this->demoId    = $demoId;
		$this->provider  = new Brizy_Import_Provider();
		$this->extractor = new Brizy_Import_Extractor( $this->provider->getExportUrl( $this->demoId, $this->getKey() ) );
	}

	/**
	 * @throws Exception
	 */
	public function import() {

		$this->extractor->getFiles();

		$parser = new Brizy_Import_Parser( $this->extractor->getPath( 'demo.xml' ) );
		$data   = $parser->parse();

		if ( ! empty( $data['importSettings']['plugins'] ) ) {
			$plugins = new Brizy_Import_Plugins( $data['importSettings']['plugins'] );
			$plugins->install();
		}

		$importer = new Brizy_Import_Importer( $data, $this->extractor );

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
