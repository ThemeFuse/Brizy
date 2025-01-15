<?php

class Brizy_Editor_Compiler {

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Admin_Blocks_Manager
	 */
	private $blocksManager;
	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	private $urlBuilder;
	private $compilerUrl;
	private $compilerDownloadUrl;

	public function __construct(
		Brizy_Editor_Project $project, Brizy_Admin_Blocks_Manager $blocksManager, Brizy_Editor_UrlBuilder $urlBuilder, $compilerUrl, $compilerDownloadUrl
	) {

		$this->project             = $project;
		$this->blocksManager       = $blocksManager;
		$this->urlBuilder          = $urlBuilder;
		$this->compilerUrl         = $compilerUrl;
		$this->compilerDownloadUrl = $compilerDownloadUrl;
	}

	public function compilePost( Brizy_Editor_Post $post, $editorConfig ) {
		$this->urlBuilder->set_post_id( $post->getWpPostId() );
		$editor_data    = $post->get_editor_data( true );
		$compilerParam  = $this->compilerParams( $editor_data, $editorConfig );
		$httpClient     = new Brizy_Editor_Http_Client();
		$compilerResult = $httpClient->request( $this->compilerUrl, array( 'body' => $compilerParam ), 'POST' )->get_response_body();
		if ( ! is_array( $compilerResult ) ) {
			throw new UnexpectedValueException( 'The compiler response body is invalid' );
		}
		// process page data
		$pageData = $compilerResult['compiled']['page'];
		// update post
		$this->updatePost( $post, $pageData );
		// update project styles
		if ( isset( $compilerResult['compiled']['project'] ) ) {
			$this->updateProjectStyles( $compilerResult['compiled']['project'] );
		}
		// update global blocks
		if ( isset( $compilerResult['compiled']['globalBlocks'] ) ) {
			$this->updateGlobalBLocks( $compilerResult['compiled']['globalBlocks'] );
		}

		return true;
	}

	public function needsCompile( Brizy_Editor_Post $post ) {

		$currentCompiler = preg_replace( "/((beta\d?)?-wp)$/", "", $post->get_compiler_version() );
		$v2              = preg_replace( "/((beta\d?)?-wp)$/", "", BRIZY_MINIMUM_COMPILER_VERSION );

		if(BRIZY_EDITOR_VERSION=='dev') {
			$v2 = BRIZY_EDITOR_VERSION;
		}

		if ( version_compare( $currentCompiler, $v2, "<" ) ) {
            return true;
		}

		return false;
	}

	private function updateProjectStyles( $styles ) {
		$this->project->setCompiledStyles( $styles );
		$this->project->set_compiler( Brizy_Editor_Entity::COMPILER_BROWSER );
		$this->project->saveStorage();
	}

	private function updatePost( Brizy_Editor_Post $post, $pageData ) {
		$post->set_compiled_html( $pageData['html'] );
		$assets  = $pageData['assets'];
		$scripts = [
			'free' => $assets['freeScripts'],
			'pro'  => ( isset( $assets['proScripts'] ) ? $assets['proScripts'] : [] ),
		];
		$styles  = [
			'free' => $assets['freeStyles'],
			'pro'  => ( isset( $assets['proStyles'] ) ? $assets['proStyles'] : [] ),
		];
		$post->setCompiledScripts( $scripts );
		$post->setCompiledStyles( $styles );
		$post->set_needs_compile( false );
		$post->set_compiler( Brizy_Editor_Post::COMPILER_BROWSER );
		$post->set_compiler_version( BRIZY_EDITOR_VERSION );
		$post->set_plugin_version( BRIZY_VERSION );
		$post->set_pro_plugin_version( defined( 'BRIZY_PRO_VERSION' ) ? BRIZY_PRO_VERSION : null );
		$post->savePost();
		$post->saveStorage();
	}

	private function updateGlobalBLocks( $globalBlockData ) {
		foreach ( $globalBlockData as $blockData ) {
			$block = $this->blocksManager->getEntity( $blockData['uid'] );
			$this->updatePost( $block, $blockData );
		}
	}

	private function compilerParams( $pageData, $editorConfig ) {

		return apply_filters( 'brizy_compiler_params', array(
			'page_id'      => (int) $editorConfig['wp']['page'],
			'free_version' => BRIZY_EDITOR_VERSION,
			'free_url'     => $this->compilerDownloadUrl,
			'config_json'  => json_encode( $editorConfig ),
		) );
	}

}