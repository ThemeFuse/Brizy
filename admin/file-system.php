<?php

use Gaufrette\Adapter;
use Gaufrette\Filesystem;

/**
 * @todo: move all mkdir calls here.
 *
 * Class Brizy_FileSystem
 */
class Brizy_Admin_FileSystem {

	static private $fileSystem;

	public static function instance() {

		$urlBuilder        = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get() );
		$brizy_upload_path = $urlBuilder->brizy_upload_path();

		$adapter = apply_filters( 'brizy_filesystem_adapter', new Brizy_Admin_Guafrette_LocalAdapter( $brizy_upload_path, true, 755 ) );

		if ( ! $adapter ) {
			throw new Exception( 'Invalid file system adapter provided' );
		}

		return new self( $adapter );
	}

	/**
	 * Brizy_Admin_FileSystem constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 * @param Adapter $adapter
	 */
	public function __construct( Adapter $adapter ) {

		self::$fileSystem = new Filesystem( $adapter );
	}


	/**
	 * Will take a local file content a create a new key with the content
	 * This method will do nothing for the case when the keys are equal and the adapter is a local
	 *
	 *
	 * @param $key
	 * @param $content
	 *
	 * @return int
	 */
	public function loadFileInKey( $key, $localFile ) {
		return self::$fileSystem->write( $key, file_get_contents( $localFile ), true );
	}

	public function writeFileLocally( $key, $localFile = null ) {

		if ( ! ( self::$fileSystem->getAdapter() instanceof Brizy_Admin_Guafrette_LocalAdapter ) ) {
			file_put_contents( $localFile ? $localFile : $key, self::$fileSystem->read( $key ) );
		}
	}


	/**
	 * @param $key
	 * @param $content
	 *
	 * @return int
	 */
	public function write( $key, $content ) {
		return self::$fileSystem->write( $key, $content, true );
	}

	public function read( $key ) {
		return self::$fileSystem->read( $key );
	}

	public function delete( $key ) {
		return self::$fileSystem->delete( $key );
	}

	public function has( $key ) {
		return self::$fileSystem->has( $key );
	}


	/**
	 * @param $pageUploadPath
	 *
	 * @return bool
	 */
	public function deleteAllDirectories( $pageUploadPath ) {
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
	 *
	 * @return bool
	 */
	public function deleteFilesAndDirectory( $pageUploadPath ) {
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
