<?php

interface Brizy_Editor_ThirdParty_ExtensionInterface {

	/**
	 * @return array
	 */
	public function getScripts();

	/**
	 * @return array
	 */
	public function getStyles();

	public function getVersion();
}