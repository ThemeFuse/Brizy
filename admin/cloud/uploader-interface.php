<?php

/**
 * Interface Brizy_Admin_Cloud_UploaderInterface
 */
interface Brizy_Admin_Cloud_UploaderInterface {

	/**
	 * @param Brizy_Editor_Block $block
	 *
	 * @return mixed
	 */
	public function upload( Brizy_Editor_Block $block );

	/**
	 * @param Brizy_Editor_Block $block
	 *
	 * @return mixed
	 */
	public function delete( Brizy_Editor_Block $block );
}