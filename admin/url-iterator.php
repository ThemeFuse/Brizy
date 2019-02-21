<?php

/**
 * Class Brizy_Admin_UrlIterator
 */
class Brizy_Admin_UrlIterator extends ArrayIterator {
	/**
	 * @return mixed
	 */
	public function __toString() {
		return (string)$this->current();
	}
}