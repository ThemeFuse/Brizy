<?php

class Brizy_Parser_Pquery_DomNode extends pQuery\DomNode {

	/**
	 * We rewrite this function to not decode html with html_entity_decode as it is done in the parent
	 * Using html decode will break json that are in html atributes
	 *
	 * {@inheritDoc}
	 */
	public function getInnerText() {
		return $this->toString( true, true, 1 );
	}
}