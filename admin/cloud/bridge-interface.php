<?php

/**
 * Interface Brizy_Admin_Cloud_UploaderInterface
 */
interface Brizy_Admin_Cloud_BridgeInterface {

	/**
	 * @return mixed
	 */
	public function export( $entity );

	/**
	 * @param $entity
	 *
	 * @return mixed
	 */
	public function import( $entity );

	/**
	 * @param $entity
	 *
	 * @return mixed
	 */
	public function delete( $entity );
}