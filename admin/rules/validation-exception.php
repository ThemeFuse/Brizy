<?php


class Brizy_Admin_Rules_ValidationException extends Exception {

	/**
	 * @var string
	 */
	private $ruleId;

	public function __construct( $ruleId, $message = "", $code = 0, Throwable $previous = null ) {
		parent::__construct( $message, $code, $previous );
		$this->setRuleId( $ruleId );
	}

	/**
	 * @return string
	 */
	public function getRuleId() {
		return $this->ruleId;
	}

	/**
	 * @param string $ruleId
	 *
	 * @return Brizy_Admin_Rules_ValidationException
	 */
	public function setRuleId( $ruleId ) {
		$this->ruleId = $ruleId;

		return $this;
	}
}