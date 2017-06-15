<?php

class BitBlox_WP_Exception extends Exception {
	protected $code = 500;
	protected $message = 'Internal server error';
}