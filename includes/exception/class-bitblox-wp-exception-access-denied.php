<?php

class BitBlox_WP_Exception_Access_Denied extends BitBlox_WP_Exception {
	protected $code = 401;

	protected $message = 'Unauthorised access';
}