<?php

class Brizy_Editor_Exceptions_Exception extends Exception implements Serializable {
	protected $code = 500;
	protected $message = 'Internal server error';

	public function serialize() {
		return serialize( $this->__serialize() );
	}

	public function unserialize( $serialized ) {
		$this->__unserialize( unserialize( $serialized, [ 'allowed_classes' => false ] ) );
	}

	/**
	 * Only code and message are kept: the trace may hold closures or other
	 * non-serializable arguments.
	 *
	 * @return array
	 */
	public function __serialize() {
		return [ 'code' => $this->getCode(), 'message' => $this->getMessage() ];
	}

	public function __unserialize( $data ) {
		$this->code    = $data['code'] ?? $this->code;
		$this->message = $data['message'] ?? $this->message;
	}
}
