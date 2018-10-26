<?php

class Brizy_Content_DynamicContentProcessor implements Brizy_Editor_Content_ProcessorInterface {

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 */
	public function __construct( $project, $post = null ) {
		$this->post    = $post;
		$this->project = $project;
	}

	/**
	 * @param $content
	 *
	 * @return mixed
	 */
	public function process( $content ) {

		$context = Brizy_Content_ContextFactory::createContext( $this->project, $this->post, $this->post->get_wp_post(), $content );
		$context = apply_filters( 'brizy_context_create', $context, $this->post->get_wp_post() );

		$placeholderProvider = new Brizy_Content_PlaceholderProvider( $context );
		$extractor           = new Brizy_Content_PlaceholderExtractor( $context, $placeholderProvider );

		$replacer = new Brizy_Content_PlaceholderReplacer( $context, $placeholderProvider, $extractor );

		return $replacer->getContent();
	}
}