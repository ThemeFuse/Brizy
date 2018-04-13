<?php

class Brizy_Editor_Signature {

	/**
	 * @param $term
	 *
	 * @return string
	 */
	static public function cleanTerm( $term ) {
		return trim( str_ireplace(
			array( 'http://', '\\', '/' ),
			array( '' ),
			$term
		) );
	}

	/**
	 * @return array
	 */
	static private function getSignatureParts() {
		return array(
			get_option( 'siteurl' ),
			defined('WP_SITEURL')?WP_SITEURL:'',
			dirname( __FILE__ )
		);
	}

	/**
	 * @return string
	 */
	static public function get() {
		$pieces = self::getSignatureParts();

		$md_5 = md5( self::cleanTerm( implode( '-', $pieces ) ) );

		return $md_5;
	}
}