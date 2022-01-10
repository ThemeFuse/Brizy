<?php

class Brizy_Parser_DomNode extends pQuery\DomNode {
	/**
	 * Similar to JavaScript innerText, will return (html formatted) content
	 * @return string
	 */
	function getInnerText() {
		return $this->toString( true, true, 1 );
	}
}