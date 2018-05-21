<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_CompiledHtml {

	/**
	 * @var Brizy_Editor_Helper_Dom
	 */
	private $dom;

	/**
	 * @var Brizy_Editor_Asset_ProcessorInterface[]
	 */
	private $asset_processors = array();

	/**
	 * Brizy_Editor_CompiledHtml constructor.
	 *
	 * @param $html
	 */
	public function __construct( $html ) {
		$this->dom = new Brizy_Editor_Helper_Dom( $html );
	}

	/**
	 * @param Brizy_Editor_Asset_ProcessorInterface[] $asset_processors
	 */
	public function setAssetProcessors( $asset_processors ) {
		$this->asset_processors = $asset_processors;
	}


	/**
	 * @return string
	 */
	public function get_body() {

		$body_tag = $this->dom->get_body();

		$content = $body_tag->get_content();

		$content = $this->apply_asset_processors( $content );

		$content = Brizy_SiteUrlReplacer::hideSiteUrl( $content );

		return $content;
	}

	/**
	 * @param bool $include_parent_tag
	 *
	 * @return string
	 */
	public function get_head( $include_parent_tag = false ) {

		$head_tag = $this->dom->get_head();

		$content = $head_tag->get_content();

		$content = $this->apply_asset_processors( $content );

		$content = Brizy_SiteUrlReplacer::hideSiteUrl( $content );

		return $content;
	}

	private function apply_asset_processors( $content ) {

		foreach ( $this->asset_processors as $processor ) {
			$content = $processor->process( $content );
		}

		return $content;
	}


}