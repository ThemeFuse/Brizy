<?php

class Brizy_Signature {

	static private function getSignatureParts() {
		return array(
			time()
		);
	}

	static public function get() {
		return md5( implode( '-', self::getSignatureParts() ) );
	}
}