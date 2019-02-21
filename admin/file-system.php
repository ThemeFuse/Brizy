<?php

/**
 * @todo: move all mkdir calls here.
 *
 * Class Brizy_FileSystem
 */
class Brizy_Admin_FileSystem {

	/**
	 * @param $pageUploadPath
	 */
	static public function deleteAllDirectories( $pageUploadPath ) {
		try {
			$dIterator = new DirectoryIterator( $pageUploadPath );
			foreach ( $dIterator as $entry ) {
				if ( ! $entry->isDot() && $entry->isDir() ) {
					$subDirIterator = new RecursiveDirectoryIterator( $entry->getRealPath(), RecursiveDirectoryIterator::SKIP_DOTS );
					$files          = new RecursiveIteratorIterator( $subDirIterator, RecursiveIteratorIterator::CHILD_FIRST );
					foreach ( $files as $file ) {
						if ( ! $file->isDir() ) {
							@unlink( $file->getRealPath() );
						}
					}

					self::deleteFilesAndDirectory( $entry->getRealPath() );
				}
			}
		} catch ( Exception $e ) {
			return false;
		}
	}


	/**
	 * @param $pageUploadPath
	 */
	static public function deleteFilesAndDirectory( $pageUploadPath ) {
		try {
			$dIterator = new DirectoryIterator( $pageUploadPath );
			foreach ( $dIterator as $entry ) {
				if ( $entry->isDot() ) {
					continue;
				}

				if ( $entry->isDir() ) {
					$subDirIterator = new RecursiveDirectoryIterator( $entry->getRealPath(), RecursiveDirectoryIterator::SKIP_DOTS );
					$files          = new RecursiveIteratorIterator( $subDirIterator, RecursiveIteratorIterator::CHILD_FIRST );
					foreach ( $files as $file ) {
						if ( ! $file->isDir() ) {
							@unlink( $file->getRealPath() );
						}
					}

					@rmdir( $entry->getRealPath() );
				} else {
					@unlink( $entry->getRealPath() );
				}
			}

			@rmdir( $pageUploadPath );
		} catch ( Exception $e ) {
			return false;
		}

	}
}