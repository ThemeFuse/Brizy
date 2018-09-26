<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 9/26/18
 * Time: 10:40 AM
 */

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
	 * @return mixed
	 */
	protected function loadData() {
		$this->data = get_option( Brizy_Admin_Migrations_AbstractStorage::KEY, array() );
	}
}