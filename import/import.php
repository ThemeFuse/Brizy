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

		if ( ! class_exists( 'WP_Import' ) ) {
			new Brizy_Compatibilities_WordpressImporter();
		}

		try {
			$this->extractor->getFiles();

			$parser = new Brizy_Import_Parser( $this->extractor->getPath( 'demo.xml' ) );
			$data   = $parser->parse();

			if ( ! empty( $data['importSettings']['plugins'] ) ) {
				$plugins = new Brizy_Import_Plugins( $data['importSettings']['plugins'] );
				$plugins->install();
			}

			$importer = new Brizy_Import_Importer( $data, $this->extractor );

			$importer->import();

			$remap = new Brizy_Import_Remap( $importer, $data );

			$remap->remapping();

		} catch ( Exception $e ) {
			$this->cleanup();
			throw new Exception( $e->getMessage() );
		}

		Brizy_Editor_Post::mark_all_for_compilation();

		$this->cleanup();
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
