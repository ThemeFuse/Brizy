<?php

class Brizy_Editor_Exceptions_ServiceUnavailable extends Brizy_Editor_Exceptions_Exception {
	protected $code = 503;

	protected $message = 'Service Unavailable';
}