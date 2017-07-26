<?php

class Brizy_Editor_Exceptions_AccessDenied extends Brizy_Editor_Exceptions_Exception {
	protected $code = 401;

	protected $message = 'Unauthorised access';
}