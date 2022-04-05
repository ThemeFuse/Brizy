<?php defined( 'ABSPATH' ) or die();

class Brizy_Import_WpCli extends WP_CLI_Command {
	/**
	 * Import a Demo
	 *
	 * ## OPTIONS
	 *
	 * <id>
	 * : The id of the demo to import.
	 *
	 * ## EXAMPLES
	 *
	 * 1. wp brizy demo import 33
	 *      - This will import the whole demo with the id 33.
	 *
	 * @param array $args
	 * @param array $assoc_args
	 *
	 * @throws \WP_CLI\ExitException
	 */
	public function import( array $args, array $assoc_args ) {

		if ( empty( $args[0] ) ) {
			WP_CLI::error( 'Please specify the id off the demo to import' );
		}

		WP_CLI::log( 'Demo import started...' );

		$import = new Brizy_Import_Import( $args[0] );

		try {
			$import->import();
			WP_CLI::success( 'Demo imported successfully' );
		} catch ( Exception $e ) {
			WP_CLI::error( $e->getMessage() );
		}
	}
}
