<?php

class Brizy_Compatibilities_SeoPress {

	public function __construct() {
			add_filter( 'rewrite_rules_array', array( $this, 'fixRewriteRules' ), 9998 );
			add_filter('seopress_titles_desc', array($this, 'filterSeoPressTitlesDesc'), 1, 2);
	}

	/**
	 * @param $rules
	 *
	 * @return array
	 */
	public function fixRewriteRules( $rules ) {

		foreach ( $rules as $regex => $rule ) {

			$key_position = array_search( $regex, array_keys($rules) );
			$newRegex = str_replace( '(/page/(\d+))', '(?:/page/(\d+))', $regex );

			unset($rules[$regex]);

			$array_1     = array_slice( $rules, 0, $key_position, true );
			$array_slice = array_slice( $rules, $key_position, null, true );
			$rules       = array_merge(
				$array_1,
				array( $newRegex => $rule ), // Notice the new key ends with "_db"
				$array_slice
			);

		}

		return $rules;
	}


    public  function filterSeoPressTitlesDesc($meta_description, $args = []) {
        $meta_description = preg_replace('/\{\{\s*brizy_dc_global_blocks.*?\}\}/', '', $meta_description);
        return $meta_description;
    }

}

