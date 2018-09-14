<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/4/18
 * Time: 2:41 PM
 */

class Brizy_TwigEngine {

	/**
	 * @var Twig_LoaderInterface
	 */
	private $loader;

	/**
	 * @var Twig_Environment
	 */
	private $environment;

	/**
	 * @param $path
	 *
	 * @return Brizy_TwigEngine
	 * @throws Exception
	 */
	static public function instance( $path ) {

		$templates        = glob( rtrim( $path, "/" ) . "/*.html.twig" );
		$loader_templates = array();
		foreach ( $templates as $template ) {

			if ( in_array( $template, array( ".", ".." ) ) ) {
				continue;
			}

			$loader_templates[ basename( $template ) ] = file_get_contents( $template );
		}

		return new self( new Twig_Loader_Array( $loader_templates ) );
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

		if ( $path = $this->getCacheFolderPath() ) {
			$options['cache'] = $path;
		}

		$this->environment = new Twig_Environment( $loader, $options );

		if ( WP_DEBUG ) {
			$this->environment->addFunction( new Twig_SimpleFunction( 'dump', function ( $value ) {
				var_dump( $value );
			} ) );
		}
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

			Brizy_Admin_FileSystem::deleteAllDirectories($twig_cache_root);

			@mkdir( $twig_cache, 0755, true );
		}

		if ( file_exists( $twig_cache ) && is_writeable( $twig_cache ) ) {
			return $twig_cache;
		}

		return null;
	}
}