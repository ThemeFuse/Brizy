<?php

/**
 * Perfmatters plugin: https://perfmatters.io/
 */
class Brizy_Compatibilities_Perfmatters {

	public function __construct() {
		add_action( 'after_setup_theme', [ $this, 'disablePluginOptions' ] );
	}

	public function disablePluginOptions() {
		if ( ! Brizy_Public_Main::is_editing() ) {
			return;
		}

		add_action( 'option_perfmatters_options', [ $this, 'removeOptions' ] );
	}

	public function removeOptions( $options ) {
		if ( isset( $options['assets']['defer_js'] ) ) {
			unset( $options['assets']['defer_js'] );
		}

		if ( isset( $options['assets']['delay_js'] ) ) {
			unset( $options['assets']['delay_js'] );
		}

		return $options;
	}
}