<?php

class Brizy_Editor_Exceptions_Exception extends Exception implements Serializable {
	protected $code = 500;
	protected $message = 'Internal server error';

	public function serialize() {
		return serialize( [ 'code' => $this->getCode(), 'message' => $this->getMessage() ] );
	}

	public function unserialize( $serialized ) {
		$data          = $this->unserialize( $serialized );
		$this->code    = $data['code'];
		$this->message = $data['message'];
	}
}