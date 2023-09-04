<?php

use BrizyPlaceholders\PlaceholderInterface;
use BrizyPlaceholders\RegistryInterface;

class Brizy_Content_WrapperPlaceholderProvider extends Brizy_Content_PlaceholderProvider {


	/**
	 * BrizyPro_Content_ProviderPlaceholders constructor.
	 *
	 * $context: for back compatibility
	 *
	 * @param Brizy_Content_Context $context
	 */
	public function __construct( $context = null ) {
		$this->providers   = [];
		$this->providers[] = new Brizy_Content_Providers_WrapperProvider();
	}

}
