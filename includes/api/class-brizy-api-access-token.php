<?php

class Brizy_API_Access_Token {

	/**
	 * @var string $token
	 */
	private $token;

	/**
	 * @var int $token
	 */
	private $expires;

	/**
	 * @var string $token
	 */
	private $refresh;

	/**
	 * Brizy_API_Access_Token constructor.
	 *
	 * @param string $token
	 * @param int $expires
	 * @param string $refresh
	 */
	public function __construct( $token, $refresh, $expires ) {
		$this->token   = $token;
		$this->expires = (int) $expires;
		$this->refresh = $refresh;
	}

	public function access_token() {
		return $this->token;
	}

	public function get_expires() {
		return $this->expires;
	}

	public function refresh_token() {
		return $this->refresh;
	}

	public function expired() {
		return time() >= $this->get_expires();
	}

	public function export() {
		return array(
			'access_token'  => $this->access_token(),
			'refresh_token' => $this->refresh_token(),
			'expires'       => $this->get_expires(),
		);
	}
}