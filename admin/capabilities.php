<?php

class Brizy_Admin_Capabilities {

	/**
	 * @var Brizy_Editor_Storage_Common
	 */
	private $storage;

	const CAP_EDIT_WHOLE_PAGE = 'brizy_edit_whole_page';
	const CAP_EDIT_CONTENT_ONLY = 'brizy_edit_content_only';

	/**
	 * Brizy_Admin_Capabilities constructor.
	 *
	 * @param $common_storage
	 *
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function __construct( $common_storage ) {

		$this->storage            = $common_storage;
		$are_capabilities_created = $common_storage->get( 'capabilities_created', false );

		if ( ! $are_capabilities_created ) {
			$this->create_capabilities();
			$common_storage->set( 'capabilities_created', 1 );
			$this->storage->delete( 'exclude-roles' );
		}
	}

	/**
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	private function create_capabilities() {

		global $wp_roles;

		// add capability to adiministrator
		$wp_roles->add_cap( 'administrator', self::CAP_EDIT_WHOLE_PAGE );

		$roles       = Brizy_Admin_Settings::get_role_list();
		$old_explude = $this->storage->get( 'exclude-roles', false );
		$old_explude = is_array( $old_explude ) ? $old_explude : array();

		foreach ( $roles as $role ) {

			if ( $role['id'] == 'subscriber' ) {
				continue;
			}

			if ( in_array( $role['id'], $old_explude ) ) {
				$wp_roles->remove_cap( $role['id'], self::CAP_EDIT_WHOLE_PAGE );
				continue;
			}

			$wp_roles->add_cap( $role['id'], self::CAP_EDIT_WHOLE_PAGE );
		}
	}
}