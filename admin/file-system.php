<?php

use Gaufrette\Adapter;
use Gaufrette\Filesystem;

/**
 * Class Brizy_FileSystem
 */
class Brizy_Admin_FileSystem {

	/**
	 * @var Brizy_Admin_FileSystem[]
	 */
	static private $instances;
	/**
	 * @var Filesystem
	 */
	private $fileSystem;

	private $hasCache;

	/**
	 * @return Brizy_Admin_FileSystem
	 * @throws Exception
	 */
	public static function instance() {

		$adapter = apply_filters( 'brizy_filesystem_adapter', null );

		if ( ! $adapter ) {
			throw new Exception( 'Invalid file system adapter provided' );
		}

		$adapterClass = get_class( $adapter );

		if ( isset( self::$instances[ $adapterClass ] ) ) {
			return self::$instances[ $adapterClass ];
		}

		return self::$instances[ $adapterClass ] = new self( $adapter );
	}

	/**
	 * @return Brizy_Admin_FileSystem
	 * @throws Exception
	 */
	public static function localInstance() {

		$urlBuilder = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get() );
		$adapter    = new Brizy_Admin_Guafrette_LocalAdapter( $urlBuilder->upload_path(), true, 0755 );

		$adapterClass = get_class( $adapter );

		if ( isset( self::$instances[ $adapterClass ] ) ) {
			return self::$instances[ $adapterClass ];
		}

		return self::$instances[ $adapterClass ] = new self( $adapter );
	}

	/**
	 * Brizy_Admin_FileSystem constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 * @param Adapter $adapter
	 */
	private function __construct( Adapter $adapter ) {
		$this->fileSystem = new Filesystem( $adapter );
		$this->hasCache = [];
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
		$bytes = $this->write( $key, file_get_contents( $localFile ) );
		$this->hasCache[] = $key;
		return $bytes;
	}

	/**
	 * @param $key
	 * @param null $localFile
	 */
	public function writeFileLocally( $key, $localFile ) {
		$dirPath = dirname( $localFile );

		if ( ! file_exists( $dirPath ) ) {
			if ( ! mkdir( $dirPath, 0755, true ) && ! is_dir( $dirPath ) ) {
				throw new \RuntimeException( sprintf( 'Directory "%s" was not created', $dirPath ) );
			}
		}

		file_put_contents( $localFile, $this->fileSystem->read( $key ) );
	}

	/**
	 * @param $key
	 * @param $content
	 *
	 * @return int
	 */
	public function write( $key, $content ) {
		$bytes            = $this->fileSystem->write( $key, $content, true );
		$this->hasCache[] = $key;

		return $bytes;
	}

	/**
	 * @param $key
	 *
	 * @return string
	 */
	public function read( $key ) {
		return $this->fileSystem->read( $key );
	}

	/**
	 * @param $key
	 *
	 * @return bool
	 */
	public function delete( $key ) {
		$this->hasCache = array_filter( $this->hasCache, function ( $akey ) use ( $key ) {
			return $key != $akey;
		} );

		return $this->fileSystem->delete( $key );
	}

	/**
	 * @param $key
	 * @param bool $ignoreCache
	 *
	 * @return bool
	 */
	public function has( $key, $ignoreCache = false ) {

		if ( in_array( $key, $this->hasCache ) ) {
			return true;
		}

		if ( $this->fileSystem->has( $key ) ) {
			$this->hasCache[] = $key;

			return true;
		}
	}

	/**
	 * @param $key
	 */
	public function getUrl( $key ) {
		$uri = $this->fileSystem->getAdapter()->getUrl( $key );

		return $uri;
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
