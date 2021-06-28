<?php

class Brizy_Content_PlaceholderWpProvider extends Brizy_Content_PlaceholderProvider {

	const PLACEHOLDERS = [
		'brizy_dc_image_alt'
	];

	/**
	 * @return array
	 */
	public function getAllPlaceholders() {
		$out = [];

		foreach ( $this->providers as $provider ) {

			$placeholders = $provider->getAllPlaceholders();

			foreach ( $placeholders as $placeholder ) {
				if ( in_array( $placeholder->getPlaceholder(), self::PLACEHOLDERS ) ) {
					$out[] = $placeholder;
				}
			}
		}

		return $out;
	}
}
