<?php

class Brizy_TwigEngine {

	/**
	 * @var \Twig\Loader\LoaderInterface
	 */
	private $loader;

	/**
	 * @var Twig\Environment
	 */
	private $environment;

	/**
	 * @param $path
	 *
	 * @return Brizy_TwigEngine
	 * @throws Exception
	 */
	static public function instance( $path ) {

		$templates        = glob( rtrim( $path, "/" ) . "/*.twig" );
		$loader_templates = array();
		foreach ( $templates as $template ) {

			if ( in_array( $template, array( ".", ".." ) ) ) {
				continue;
			}

			$loader_templates[ basename( $template ) ] = file_get_contents( $template );
		}

		return new self( new Twig\Loader\ArrayLoader( $loader_templates ) );
	}

	/**
	 * Brizy_TwigEngine constructor.
	 *
	 * @param $loader
	 *
	 * @throws Exception
	 */
	public function __construct( $loader ) {
		$this->loader = $loader;

		$options = array( 'debug' => WP_DEBUG );

		$disabled = explode( ',', ini_get( 'disable_functions' ) );

		if ( in_array( 'eval', $disabled ) && $path = $this->getCacheFolderPath() ) {
			$options['cache'] = $path;
		}

		$this->environment = new Twig\Environment( $loader, $options );

		$this->environment->addFunction( new \Twig\TwigFunction( 'wl', function ( $key, $value ) {
			return __bt( $key, $value );
		} ) );

		$this->environment->addFunction( new \Twig\TwigFunction( '__', function ( $key, $value='default' ) {
			return __( $key, $value );
		} ) );

		$this->environment->addFunction( new \Twig\TwigFunction( 'sprintf', function ( $string, $args ) {
			return sprintf( $string, $args );
		} ) );

		if ( WP_DEBUG ) {
			$this->environment->addFunction( new \Twig\TwigFunction( 'dump', function ( $value ) {
				var_dump( $value );
			} ) );

			$this->environment->addFunction( new \Twig\TwigFunction( 'get_pagenum_link', function ( $value ) {
				return get_pagenum_link( $value, false );
			} ) );
		}
	}

	/**
	 * @return Twig_Environment
	 */
	public function getEnvironment() {
		return $this->environment;
	}

	/**
	 * @param $template_name
	 * @param array $context
	 *
	 * @return string
	 * @throws Twig_Error_Loader
	 * @throws Twig_Error_Runtime
	 * @throws Twig_Error_Syntax
	 */
	public function render( $template_name, $context = array() ) {
		return $this->environment->load( $template_name )->render( $context );
	}


	public function load( $template_name ) {
		return $this->environment->load( $template_name );
	}

	/**
	 * @throws Exception
	 * @return string
	 */
	private function getCacheFolderPath() {
		$brizy_editor_url_builder = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get() );
		$twig_cache_root          = $brizy_editor_url_builder->upload_path( 'brizy/twig/' );
		$twig_cache               = $brizy_editor_url_builder->upload_path( 'brizy/twig/' . BRIZY_VERSION . '/' );

		if ( ! file_exists( $twig_cache ) ) {
			// delete all folders from brizy/twig

			Brizy_Admin_FileSystem::deleteAllDirectories( $twig_cache_root );

			if ( !file_exists( $twig_cache ) && ! @mkdir( $twig_cache, 0755, true ) && ! is_dir( $twig_cache ) ) {
				throw new \RuntimeException( sprintf( 'Directory "%s" was not created', $twig_cache ) );
			}
		}

		if ( file_exists( $twig_cache ) && is_writeable( $twig_cache ) ) {
			return $twig_cache;
		}

		return null;
	}
}
