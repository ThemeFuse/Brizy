<?php
/*
 * WordPress themes
 */
class Brizy_Compatibilities_WpThemes {

	public function __construct() {
		add_action( 'template_include', [ $this, 'template_include' ], 21000 );
	}

	/**
	 * In case of our template brizy-blank-template.php remove duplicate title tag from head for newest default wp themes
	 *
	 * @param string $templatesPath
	 *
	 * @return string
	 */
	public function template_include( $templatesPath ) {

		if ( false !== strpos( $templatesPath, Brizy_Config::BRIZY_BLANK_TEMPLATE_FILE_NAME ) ) {
			remove_action( 'wp_head', '_block_template_render_title_tag', 1 );
		}

		return $templatesPath;
	}
}
