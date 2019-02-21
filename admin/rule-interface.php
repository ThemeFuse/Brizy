<?php

interface Brizy_Admin_RuleInterface {
	public function isMatching( $applyFor, $entityType, $entityValues );

	public function getRuleWeight();
}