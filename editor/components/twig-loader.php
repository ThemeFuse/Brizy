<?php


class Brizy_Editor_Components_TwigLoader implements Twig_LoaderInterface {

	/**
	 * @var Brizy_Editor_Components_Abstract_Component
	 */
	private $component;

	/**
	 * Brizy_Editor_Components_TwigLoader constructor.
	 *
	 * @param Brizy_Editor_Components_Abstract_Component $component
	 */
	public function __construct( Brizy_Editor_Components_Abstract_Component $component ) {
		$this->component = $component;
	}

	/**
	 * Gets the source code of a template, given its name.
	 *
	 * @param string $name The name of the template to load
	 *
	 * @return string The template source code
	 *
	 * @throws Twig_Error_Loader When $name is not found
	 *
	 * @deprecated since 1.27 (to be removed in 2.0), implement Twig_SourceContextLoaderInterface
	 */
	public function getSource( $name ) {
		$config = $this->component->getConfig();

		return $config['html'];
	}

	/**
	 * Gets the cache key to use for the cache for a given template name.
	 *
	 * @param string $name The name of the template to load
	 *
	 * @return string The cache key
	 *
	 * @throws Twig_Error_Loader When $name is not found
	 */
	public function getCacheKey( $name ) {
		return md5( $name );
	}

	/**
	 * Returns true if the template is still fresh.
	 *
	 * @param string $name The template name
	 * @param int $time Timestamp of the last modification time of the
	 *                     cached template
	 *
	 * @return bool true if the template is fresh, false otherwise
	 *
	 * @throws Twig_Error_Loader When $name is not found
	 */
	public function isFresh( $name, $time ) {
		return false;
	}
}