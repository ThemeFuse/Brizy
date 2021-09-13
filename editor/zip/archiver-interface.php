<?php

interface Brizy_Editor_Zip_ArchiverInterface {

	public function createZip( $posts, $fileName );

	public function createFromZip( $zipPath );

	public function getEditorVersion();

	public function isVersionSupported($version);

	public function getScreenshotType($archiveType);
}