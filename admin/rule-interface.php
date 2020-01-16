<?php

interface Brizy_Admin_RuleInterface {

	/**
	 * @param $applyFor
	 * @param $entityType
	 * @param $entityValues
	 *
	 * @return mixed
	 */
	public function isMatching( $applyFor, $entityType, $entityValues );

	/**
	 * @param $context
	 *
	 * @return mixed
	 */
	public function getRuleWeight($context);
}