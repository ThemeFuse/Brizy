<?php

class Brizy_Compatibilities_Wpml_Keys_Options extends Brizy_Compatibilities_Wpml_Keys_Abstract {

	protected $key = 'options';

	public function getName() {
		return __( 'Field Options', 'brizy' );
	}

	public function isValid() {
		return isset( $this->item['type'] ) && isset( $this->item['required'] );
	}

	public function getValue() {

		$options = [];

		foreach ( $this->item[ $this->key ] as $option ) {
			$item = [
				'_id'    => md5( $option ),
				'option' => $option
			];

			$options[] = new Brizy_Compatibilities_Wpml_Keys_Option( $item );
		}

		return $options;
	}
}
