<?php

class Brizy_Compatibilities_Wpml_Keys_LabelText extends Brizy_Compatibilities_Wpml_Keys_Abstract {

	protected $key = 'labelText';

	public function getName() {
		return __( 'Tab title', 'brizy' );
	}

	public function getType() {
		return 'LINE';
	}
}
