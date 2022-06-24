<?php

class Brizy_Compatibilities_Wpml_Keys_Text extends Brizy_Compatibilities_Wpml_Keys_Abstract {

	protected $key = 'text';

	public function getName() {
		return __( 'Text', 'brizy' );
	}
}
