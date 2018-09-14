<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 9/14/18
 * Time: 4:40 PM
 */

class Brizy_Editor_Twig_Enviroment extends Twig_Environment {

	private $originalCache;

	public function setCache( $cache ) {
		if ( is_string( $cache ) ) {
			$this->originalCache = $cache;
			$this->cache         = new Brizy_Editor_Twig_CacheFileSystem( $cache );
		} else {
			parent::setCache( $cache );
		}
	}
}