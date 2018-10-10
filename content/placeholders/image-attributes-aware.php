<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 10/10/18
 * Time: 3:18 PM
 */

trait Brizy_Content_Placeholders_ImageAttributesAware {

	/**
	 * It should return a string containigng image attributes
	 * Ex: alt="image alt attribute" title="Image title"
	 *
	 * @param Brizy_Content_Context $context
	 *
	 * @return
	 */
	abstract public function getImageAttributes( Brizy_Content_Context $context );
}