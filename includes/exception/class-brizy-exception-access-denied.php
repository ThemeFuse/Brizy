<?php

class Brizy_Exception_Access_Denied extends Brizy_Exception {
	protected $code = 401;

	protected $message = 'Unauthorised access';
}