<?php


class Brizy_Content_Providers_FreeProvider extends Brizy_Content_Providers_AbstractProvider {

	/**
	 * @return array|mixed
	 */
	public function getGroupedPlaceholders() {
		return array();
	}

	/**
	 * @return array|int
	 * @throws Exception
	 */
	public function getAllPlaceholders() {

		return array(
			new Brizy_Content_Placeholders_ImageTitleAttribute( 'Internal Title Attributes', 'brizy_dc_image_title' ),
			new Brizy_Content_Placeholders_ImageAltAttribute( 'Internal Alt Attributes', 'brizy_dc_image_alt' ),
			new Brizy_Content_Placeholders_UniquePageUrl( 'Uniquer page url','brizy_dc_current_page_unique_url' ),
			new Brizy_Content_Placeholders_Simple( 'WP Language', 'brizy_dc_page_language', get_locale() )
		);
	}
}
