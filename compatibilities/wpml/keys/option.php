<?php

class Brizy_Compatibilities_Wpml_Keys_Option extends Brizy_Compatibilities_Wpml_Keys_Abstract {

	protected $key = 'option';

	public function getName() {
		return __( 'Field Option', 'brizy' );
	}

	public function getType() {
		return 'LINE';
	}
}
