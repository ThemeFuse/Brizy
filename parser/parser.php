<?php

class Brizy_Parser_Parser {

	private $html;

	public function __construct( $html ) {
		$this->html = $html;
	}

	public function getParser() {

		if ( extension_loaded( 'dom' ) ) {
			return new Brizy_Parser_DomDocument( $this->html );
		}

		return new Brizy_Parser_DomPquery( $this->html );
	}
}