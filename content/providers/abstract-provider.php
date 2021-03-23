<?php

abstract class Brizy_Content_Providers_AbstractProvider implements Brizy_Content_Providers_Interface {

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
			$out = array_merge( $out, call_user_func_array( 'array_merge', array_values($placeholders) ) );
		}
		return $out;
	}

	/**
	 * @param $handle string
	 * @param $deps array
	 *
	 * @return bool
	 */
	protected function setScriptDependency( $handle, $deps ) {

		global $wp_scripts;

		$script = $wp_scripts->query( $handle );

		if ( ! $script ) {
			return false;
		}

		foreach ( $deps as $dep ) {
			if ( ! in_array( $dep, $script->deps ) ) {
				$script->deps[] = $dep;
			}
		}

		return true;
	}
}
