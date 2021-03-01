<?php

class Brizy_Compatibilities_Tfuse {

	public function __construct() {
		add_filter( 'the_content', [ $this, 'the_content' ] );
	}

	public function the_content( $content ) {

		if ( strpos( $content, 'brz-root__container' ) ) {
			remove_filter( 'the_content', 'tfuse_formatter', 99 );
		}

		return $content;
	}
}
