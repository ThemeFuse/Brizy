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
	 * @param Brizy_Content_Context $context
	 */
	public function __construct( Brizy_Content_Context $context ) {

		$this->context = $context;

		$this->processors[] = new Brizy_Content_ShortcodeToPlaceholderProcessor();
		$this->processors[] = new Brizy_Editor_Asset_DomainProcessor();
		$this->processors[] = new Brizy_Content_DynamicContentProcessor();
		$this->processors[] = new Brizy_Editor_Asset_ImgProcessor();
		$this->processors[] = new Brizy_Editor_Asset_MediaProcessor();

		$this->processors = apply_filters( 'brizy_content_processors', $this->processors, $context );
	}

	/**
	 * @param $content
	 *
	 * @return string
	 */
	public function process( $content ) {

		$processors = apply_filters( 'brizy_apply_content_processors', $this->processors );

		foreach ( $processors as $processor ) {
			$content = $processor->process( $content, $this->context );
		}

		return $content;
	}

}
