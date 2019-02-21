<?php


class Brizy_Admin_Migrations_PostStorage extends Brizy_Admin_Migrations_AbstractStorage {

	/**
	 * @var int
	 */
	protected $postId;

	/**
	 * Brizy_Admin_Migations_PostStorage constructor.
	 *
	 * @param int $postId
	 */
	public function __construct( $postId ) {
		$this->postId = (int) $postId;

		parent::__construct();
	}

	/**
	 * Save run migrations
	 *
	 * @return mixed
	 */
	protected function storeData() {
		update_post_meta( $this->postId, Brizy_Admin_Migrations_AbstractStorage::KEY, $this->data );
	}

	/**
	 * @return mixed
	 */
	protected function loadData() {
		$get_post_meta = get_post_meta( $this->postId, Brizy_Admin_Migrations_AbstractStorage::KEY, true );
		$this->data    = is_array( $get_post_meta ) ? $get_post_meta : array();
	}
}