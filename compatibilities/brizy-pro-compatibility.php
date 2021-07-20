<?php

class Brizy_Compatibilities_BrizyProCompatibility {

	public function __construct() {
		if ( version_compare( BRIZY_PRO_VERSION, '2.3.0' ) < 1 && version_compare( BRIZY_VERSION, '2.3.0' ) ) {
			$proMain = new BrizyPro_Main();
			add_action( 'wp_loaded', [ $proMain, 'wordpressLoaded' ], 11 );
			add_action( 'admin_notices', [ $this, 'brizypro_upgrade_required' ] );
			add_action( 'brizy_allow_plugin_included', '__return_false' );
		}
	}

	/**
	 * @param $upgrader_object
	 * @param $options
	 */
	public function brizypro_upgrade_required() {
		?>
			<div class="notice notice-error is-dismissible">
				<p>
					<b><?php echo strtoupper( __bt( 'brizy', 'Brizy' ) ) ?> PRO IS NOT RUNNING. </b><br>
					Please update <?php echo __bt( 'brizy', 'Brizy' ) ?> PRO 2.3.0 or newer.
				</p>
			</div>
		<?php
	}
}