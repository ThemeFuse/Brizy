<?php

interface Brizy_Editor_Zip_ArchiverInterface {
	public function createZip( $posts, $outZipPath = null );

	public function createFromZip( $zipPath );

	public function getEditorVersion();

	public function supportBlockVersion($version);
}