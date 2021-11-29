<?php

interface Brizy_Editor_Asset_Crop_ServiceInterface {

	/**
	 * Brizy_Editor_Asset_Crop_ServiceInterface constructor.
	 *
	 * @param string $sourcePath File paths
	 * @param string $targetPath File paths
	 */
	public function __construct( $sourcePath, $targetPath );

	/**
	 * @param int $offsetX
	 * @param int $offsetY
	 * @param int $width
	 * @param int $height
	 *
	 * @return bool
	 */
	public function crop( $offsetX, $offsetY, $width, $height );

	/**
	 * @param int $width
	 * @param int $height
	 *
	 * @return bool
	 */
	public function resize( $width, $height );

	/**
	 * @return mixed
	 */
	public function getSize();

	/**
	 * @return bool
	 */
	public function saveTargetImage();
}