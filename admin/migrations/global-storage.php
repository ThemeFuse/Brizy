<?php

class Brizy_Admin_Migrations_GlobalStorage extends Brizy_Admin_Migrations_AbstractStorage {

	/**
	 * Save run migrations
	 *
	 * @return mixed
	 */
	protected function storeData() {
		update_option( Brizy_Admin_Migrations_AbstractStorage::KEY, $this->data );
	}

	/**
	 * @return mixed|void
	 * @throws Exception
	 */
	protected function loadData() {
		$this->data = get_option( Brizy_Admin_Migrations_AbstractStorage::KEY, array() );


		foreach ( $this->data as $i => $migration ) {
			if ( $migration instanceof __PHP_Incomplete_Class ) {
				throw new Brizy_Admin_Migrations_UpgradeRequiredException( 'Please update the plugin to the latest version' );
			}
		}
	}
}
