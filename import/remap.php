<?php defined( 'ABSPATH' ) or die();

class Brizy_Import_Remap {

	private $importer;
	private $args;

	public function __construct( Brizy_Import_Importer $importer, array $args ) {
		$this->importer = $importer;
		$this->args     = $args;
	}

	public function remapping() {
		$this->setHome();
	}

	private function setHome() {
		if ( empty( $this->args['importSettings']['home'] ) ) {
			return;
		}

		$homeId = $this->args['importSettings']['home'];

		if ( empty( $this->importer->processed_posts[ $homeId ] ) ) {
			return;
		}

		update_option( 'show_on_front', 'page' );

		update_option( 'page_on_front', $this->importer->processed_posts[ $homeId ] );
	}
}
