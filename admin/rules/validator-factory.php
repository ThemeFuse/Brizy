<?php


class Brizy_Admin_Rules_ValidatorFactory {

	/**
	 * @param int $postId
	 *
	 * @return Brizy_Admin_Rules_PopupRuleValidator|Brizy_Admin_Rules_TemplateRuleValidator|null
	 */
	static public function getValidator( $postId ) {
		$postType = get_post_type( $postId );

		switch ( $postType ) {
			case Brizy_Admin_Templates::CP_TEMPLATE:
				return new Brizy_Admin_Rules_TemplateRuleValidator( $postId, new Brizy_Admin_Rules_Manager() );
				break;
			case Brizy_Admin_Popups_Main::CP_POPUP:
				return new Brizy_Admin_Rules_PopupRuleValidator( $postId, new Brizy_Admin_Rules_Manager() );
				break;

			default:
				return null;
		}
	}
}