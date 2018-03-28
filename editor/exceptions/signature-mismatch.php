<?php

class Brizy_Editor_Exceptions_SignatureMismatch extends Brizy_Editor_Exceptions_Exception {
	protected $code = 409;
	protected $message = 'Signature mismatch';
}