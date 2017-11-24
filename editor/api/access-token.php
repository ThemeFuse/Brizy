<?php

class Brizy_Editor_API_AccessToken {

	/**
	 * @var string $token
	 */
	private $token;

	/**
	 * @var string $token
	 */
	private $refresh_token;

	/**
	 * @var int $token
	 */
	private $expires;

	/**
	 * Brizy_API_Access_Token constructor.
	 *
	 * @param string $token
	 * @param int $expires
	 */
	public function __construct( $token, $expires ) {
		$this->token   = $token;
		$this->expires = (int) $expires;
	}

	public function access_token() {
		return $this->token;
	}

	public function get_expires() {
		return $this->expires;
	}

	public function expired() {
		return time() >= $this->get_expires();
	}

	/**
	 * @return string
	 */
	public function get_refresh_token() {
		return $this->refresh_token;
	}

	/**
	 * @param $refresh_token
	 *
	 * @return $this
	 */
	public function set_refresh_token( $refresh_token ) {
		$this->refresh_token = $refresh_token;

		return $this;
	}



	public function export() {
		return array(
			'access_token'  => $this->access_token(),
			'expires'       => $this->get_expires(),
		);
	}
}