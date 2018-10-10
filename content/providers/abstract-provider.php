<?php

abstract class Brizy_Content_Providers_AbstractProvider implements Brizy_Content_Providers_Interface {

	/**
	 * @var Brizy_Content_Context
	 */
	protected $context;

	/**
	 * BrizyPro_Content_ProviderWp constructor.
	 *
	 * @param Brizy_Content_Context $context
	 */
	public function __construct( Brizy_Content_Context $context ) {
		$this->context = $context;
	}

	/**
	 * @return array
	 */
	protected function getDefaultGroupPlaceholders() {
		return array(
			self::CONFIG_KEY_TEXT     =>array(),
			self::CONFIG_KEY_IMAGE    =>array(),
			self::CONFIG_KEY_LINK     =>array(),
			self::CONFIG_KEY_OEMBED   =>array(),
			self::CONFIG_KEY_VIDEO    =>array(),
			self::CONFIG_KEY_SNDCLOUD =>array(),

		);
	}

	/**
	 * @return array
	 */
	public function getAllPlaceholders() {
		$out = array();

		foreach ( $this->getGroupedPlaceholders() as $placeholders ) {
			$out = array_merge( $out, call_user_func_array( 'array_merge', $placeholders ) );
		}

		return $out;
	}
}