<?php


class Brizy_Editor_Asset_DomainProcessor implements Brizy_Editor_Content_ProcessorInterface {


	/**
	 * @param string $content
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed|null|string|string[]
	 */
	public function process( $content, Brizy_Content_Context $context ) {

		$url = home_url();

		$content = Brizy_SiteUrlReplacer::restoreSiteUrl( $content, $url );

		return $content;
	}
}
