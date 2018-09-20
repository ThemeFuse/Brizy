<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 9/20/18
 * Time: 10:07 AM
 */

/**
 * Class Brizy_Admin_UrlIterator
 */
class Brizy_Admin_UrlIterator extends ArrayIterator {
	/**
	 * @return mixed
	 */
	public function __toString() {
		return $this->current();
	}
}