<?php

class Brizy_Compatibilities_Bbpress {

	public function __construct() {
		add_action( 'bbp_template_include', [ $this, 'bbp_template_include' ], 3 );
		add_action( 'bbp_get_forum_content', [ $this, 'bbp_get_forum_content' ], 10, 2 );
		add_action( 'brizy_settings_post_types', [ $this, 'settings_post_types' ] );
	}

	public function bbp_template_include( $template ) {

		if ( ! bbp_is_single_forum() && ! bbp_is_single_topic() && ! bbp_is_single_reply() ) {
			return $template;
		}

		$pid = Brizy_Editor::get()->currentPostId();
		$rmTpl = false;

		try {
			if (
				$pid &&
				in_array( get_post_type( $pid ), Brizy_Editor::get()->supported_post_types() ) &&
				Brizy_Editor_Entity::isBrizyEnabled( $pid )
			) {
				$rmTpl = true;
			}
		} catch ( Exception $e ) {}

		try {
			if ( Brizy_Admin_Templates::instance()->getTemplateForCurrentPage() ) {
				$rmTpl = true;
			}
		} catch ( Exception $e ) {}

		if ( $rmTpl ) {
			remove_filter( 'bbp_template_include', 'bbp_template_include_theme_compat', 4 );
		}

		return $template;
	}

	/*
	 * Do not return html in the forums list admin panel if forum is edited with brizy.
	 */
	public function bbp_get_forum_content( $content, $forumId ) {

		global $pagenow;

		if ( ! is_admin() || 'edit.php' != $pagenow || ! isset( $_GET['post_type'] ) || bbp_get_forum_post_type() != $_GET['post_type'] || ! Brizy_Editor_Entity::isBrizyEnabled( $forumId ) ) {
			return $content;
		}

		return '';
	}

	/*
	 * Do not allow to edit replies with brizy, only creating templates for them is allowed.
	 */
	public function settings_post_types( $types ) {

		$reply = bbp_get_reply_post_type();

		if ( isset( $types[ $reply ] ) ) {
			unset( $types[ $reply ] );
		}

		return $types;
	}
}