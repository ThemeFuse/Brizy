<?php

/**
 * Thrown when the cloud does not accept an upload.
 *
 * The code is the HTTP status, or 0 when there was no response (timeout, connection error).
 */
class Brizy_Admin_Cloud_UploadException extends Exception {

	/**
	 * 4xx statuses that are not about the uploaded entity: the cloud session (401, 403) or a
	 * request to try again later (408, 429).
	 */
	const RETRYABLE_CLIENT_ERRORS = array( 401, 403, 408, 429 );

	/**
	 * @var bool
	 */
	private $retryable;

	/**
	 * @param string $message
	 * @param int $status
	 * @param bool $retryable True when the rejection is known not to be caused by the entity.
	 */
	public function __construct( $message = '', $status = 0, $retryable = false ) {
		parent::__construct( $message, (int) $status );

		$this->retryable = (bool) $retryable;
	}

	/**
	 * An entity rejected by the cloud (4xx) fails the same way on every retry, so the failure is
	 * final until the entity changes.
	 *
	 * @return bool
	 */
	public function isFinal() {
		$status = $this->getCode();

		return ! $this->retryable &&
		       $status >= 400 && $status < 500 &&
		       ! in_array( $status, self::RETRYABLE_CLIENT_ERRORS, true );
	}
}
