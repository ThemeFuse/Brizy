<?php

class Brizy_Compatibilities_Wpml_Keys_Placeholder extends Brizy_Compatibilities_Wpml_Keys_Abstract {

	protected $key = 'placeholder';

	public function getName() {
		return __( 'Field Placeholder', 'brizy' );
	}
}
