<?php

class Brizy_Editor_Exceptions_NotFound extends Brizy_Editor_Exceptions_Exception {
	protected $code = 404;

	protected $message = 'Not Found';


	public function __construct( $message = "", $code = 0, Throwable $previous = null ) {
		parent::__construct( $message, $code, $previous );
	}
}