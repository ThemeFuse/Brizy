<?php

class Brizy_Signature {

	static private function getSignatureParts() {
		return array(
			get_option('siteurl'),
			WP_SITEURL,
			dirname(__FILE__)
		);
	}

	static public function get() {
		$pieces = self::getSignatureParts();

		return md5( implode( '-', $pieces ) );
	}
}