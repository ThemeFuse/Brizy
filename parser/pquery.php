<?php

class Brizy_Parser_Pquery extends pQuery {

	/**
	 * Query a string of html.
	 *
	 * @param string $html
	 *
	 * @return pQuery\DomNode Returns the root dom node for the html string.
	 */
	public static function parseStr( $html ) {
		$parser = new pQuery\Html5Parser( $html, 0, new Brizy_Parser_DomNode( '~root~', null ) );

		return $parser->root;
	}
}