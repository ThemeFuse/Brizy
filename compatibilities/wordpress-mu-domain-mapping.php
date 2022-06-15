<?php
/**
 * Compatibility with WordPress MU Domain Mapping plugin: https://wordpress.org/plugins/wordpress-mu-domain-mapping/
 */
class Brizy_Compatibilities_WordpressMuDomainMapping {

	public function __construct() {
		add_action( 'template_redirect', array( $this, 'remove_redirect_to_mapped_domain' ), 9 );
	}

	public function remove_redirect_to_mapped_domain() {

		if (  isset( $_GET[Brizy_Editor::prefix('-edit')] ) || isset( $_GET[Brizy_Editor::prefix('-edit-iframe')] ) ) {
			remove_action( 'template_redirect', 'redirect_to_mapped_domain' );
		}
	}
}