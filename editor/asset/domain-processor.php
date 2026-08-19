<?php


class Brizy_Editor_Asset_DomainProcessor implements Brizy_Editor_Content_ProcessorInterface {


	/**
	 * @param string $content
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed|null|string|string[]
	 */
	public function process( $content, Brizy_Content_Context $context ) {

		// Language neutral on purpose: the same asset must resolve to the same url on
		// every locale, and Brizy_Editor_Asset_ImgProcessor/MediaProcessor match against
		// the very url this restores.
		$url = Brizy_Editor_UrlBuilder::homeUrl();

		$content = Brizy_SiteUrlReplacer::restoreSiteUrl( $content, $url );

		return $content;
	}
}
