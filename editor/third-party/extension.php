<?php

final class Brizy_Editor_ThirdParty_Extension implements Brizy_Editor_ThirdParty_ExtensionInterface {

	private $scripts = [];

	private $styles = [];
	private $version = '1.0.0';

	public function __construct( $scripts, $styles, $version = '1.0.0' ) {
		$this->scripts = $scripts;
		$this->styles  = $styles;
		$this->version = $version;
	}

	public function getScripts() {
		return $this->scripts;

	}

	public function getStyles() {
		return $this->styles;
	}

	public function getVersion() {
		return $this->version;
	}
}