<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/18/18
 * Time: 10:46 AM
 */

class Brizy_Editor_Asset_DomainProcessor implements Brizy_Editor_Content_ProcessorInterface {


	/**
	 * @param string $content
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed|null|string|string[]
	 */
	public function process( $content, Brizy_Content_Context $context ) {

		$content = Brizy_SiteUrlReplacer::restoreSiteUrl( $content );

		return $content;
	}
}