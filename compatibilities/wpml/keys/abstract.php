<?php

abstract class Brizy_Compatibilities_Wpml_Keys_Abstract {

	/**
	 * Translatable keys we are looking for in the json
	 *
	 * @type array
	 */
	const KEYS = [
		'text',
		'placeholder',
		'label',
		'options',
		'labelText',
	];

	/**
	 * The key we found(existing in self::KEYS), defined in the child class
	 *
	 * @var string
	 */
	protected $key = '';

	/**
	 * @var array
	 */
	protected $item;

	/**
	 * @param array $item
	 */
	public function __construct( $item ) {
		$this->item = $item;
	}

	public function isValid() {
		return true;
	}

	public function getId() {
		return isset( $this->item['_id'] ) ? $this->item['_id'] : null;
	}

	public function getType() {
		return 'AREA'; // the string type: 'LINE', 'TEXTAREA', 'VISUAL', 'LINK'
	}

	public function getValue() {
		if ( ! $this->key ) {
			return 'String Error';
		}

		return $this->item[ $this->key ];
	}

	abstract public function getName();
}
