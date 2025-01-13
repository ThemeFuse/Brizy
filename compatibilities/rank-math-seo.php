<?php

class Brizy_Compatibilities_RankMathSEO {

	public function __construct() {
		add_filter( 'rank_math/frontend/description', array( $this, 'del_preview_placeholders' ), 10, 1 );
	}

	function del_preview_placeholders( $meta_description ) {
		return preg_replace( '/\{\{\s*brizy_dc_global_blocks.*?\}\}/', '', $meta_description );
	}
}
