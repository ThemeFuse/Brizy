<?php


class Brizy_Content_MainProcessor {

	/**
	 * @var Brizy_Editor_Content_ProcessorInterface[]
	 */
	private $processors = array();


	/**
	 * @var Brizy_Content_Context
	 */
	private $context;

	/**
	 * Brizy_Content_MainProcessor constructor.
	 *
	 * @param $context
	 */
	public function __construct( Brizy_Content_Context $context ) {

		$this->context = $context;

		$this->processors[] = new Brizy_Editor_Asset_DomainProcessor();
		$this->processors[] = new Brizy_Content_DynamicContentProcessor();

		$urlBuilder    = new Brizy_Editor_UrlBuilder( $context->getProject(), $context->getWpPost() ? $context->getWpPost()->ID : null );
		$asset_storage = new Brizy_Editor_Asset_AssetProxyStorage( $urlBuilder );
		$media_storage = new Brizy_Editor_Asset_MediaProxyStorage( $urlBuilder );

		$this->processors[] = new Brizy_Editor_Asset_AssetProxyProcessor( $asset_storage );
		$this->processors[] = new Brizy_Editor_Asset_MediaAssetProcessor( $media_storage );
		$this->processors[] = new Brizy_Editor_Asset_SvgAssetProcessor(  );

		$this->processors = apply_filters( 'brizy_content_processors', $this->processors, $context );

		array_unshift( $this->processors, new Brizy_Content_ShortcodeToPlaceholderProcessor(), new Brizy_Content_DynamicContentProcessor() );
	}

	/**
	 * @param $content
	 *
	 * @return string
	 */
	public function process( $content ) {
		$content = html_entity_decode( $content, ENT_QUOTES | ENT_HTML5, get_bloginfo( 'charset' ) );

		$processors = apply_filters( 'brizy_apply_content_processors', $this->processors );

		foreach ( $processors as $processor ) {
			$content = $processor->process( $content, $this->context );
		}

		return $content;
	}

}