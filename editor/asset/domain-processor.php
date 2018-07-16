<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/18/18
 * Time: 10:46 AM
 */

class Brizy_Editor_Asset_DomainProcessor implements Brizy_Editor_Content_ProcessorInterface {


	/**
	 * Find and cache all assets and replace the urls with new local ones.
	 *
	 * @param $content
	 *
	 * @return string
	 */
	public function process( $content ) {

		$content = Brizy_SiteUrlReplacer::restoreSiteUrl( $content );

		return $content;
	}
}