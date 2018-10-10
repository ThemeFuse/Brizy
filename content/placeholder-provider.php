<?php

class Brizy_Content_PlaceholderProvider extends Brizy_Content_Providers_AbstractProvider {

	/**
	 * @var array of implements Brizy_Editor_Content_PlaceholdersProviderInterface
	 */
	private $providers = array();

	/**
	 * @var array
	 */
	static private $cache = null;

	/**
	 * BrizyPro_Content_ProviderPlaceholders constructor.
	 *
	 * @param Brizy_Content_Context $context
	 */
	public function __construct( $context ) {

		parent::__construct( $context );

		$this->providers[] = new Brizy_Content_Providers_FreeProvider( $context );
		$this->providers   = apply_filters( 'brizy_providers', $this->providers, $context );

		$context->setProvider( $this );
	}

	/**
	 * @return array
	 */
	public function getGroupedPlaceholders() {

		if ( self::$cache ) {
			return self::$cache;
		}

		$placeholders = array();
		$keys         = array();

		foreach ( $this->providers as $provider ) {

			foreach ( $provider->getGroupedPlaceholders() as $provider_name => $provider_placeholders ) {
				/*$placeholders[ $provider_name ] = $provider_placeholders; - better way; to clean wp provider*/

				foreach ( $provider_placeholders as $type => $holders ) {

					if ( ! isset( $placeholders[ $type ][ $provider_name ] ) ) {
						$placeholders[ $type ][ $provider_name ] = array();
					}

					if ( 'wp' === $provider_name ) {
						$keys                        = array_filter( $keys, 'is_string' );
						$placeholders[ $type ]['wp'] = array_values( array_diff_key( $holders, array_fill_keys( $keys, '' ) ) );
						continue;
					}

					$placeholders[ $type ][ $provider_name ] = array_merge( $placeholders[ $type ][ $provider_name ], array_values( $holders ) );
					$keys                                    = array_merge( $keys, array_keys( $holders ) );
				}
			}
		}

		return apply_filters( 'brizy_placeholders', self::$cache = $placeholders );
	}

	/**
	 * @return array
	 */
	public function getAllPlaceholders() {
		$out = array();

		foreach ( $this->providers as $provider ) {
			$out = array_merge( $out, $provider->getAllPlaceholders() );
		}

		return $out;
	}

	/**
	 * @param $name
	 *
	 * @return Brizy_Content_Placeholders_Abstract
	 */
	public function getPlaceholder( $name ) {
		foreach ( $this->getAllPlaceholders() as $placeholder ) {
			if ( $placeholder->getPlaceholder() == $name ) {
				return $placeholder;
			}
		}
	}
}