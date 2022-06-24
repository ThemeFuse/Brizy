<?php

class Brizy_Compatibilities_Wpml_Keys_Label extends Brizy_Compatibilities_Wpml_Keys_Abstract {

	protected $key = 'label';

	public function getName() {
		return __( 'Field Label', 'brizy' );
	}

	public function isValid() {
		return ( ! isset( $this->item['_styles'] ) || ( ! in_array( 'form2', $this->item['_styles'] ) && ! in_array( 'Form2', $this->item['_styles'] ) ) );
	}
}
