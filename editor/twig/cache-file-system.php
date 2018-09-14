<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 9/14/18
 * Time: 4:44 PM
 */

class Brizy_Editor_Twig_CacheFileSystem extends Twig_Cache_Filesystem {

	public $options;

	/**
	 * @param $directory string The root cache directory
	 * @param $options   int    A set of options
	 */
	public function __construct( $directory, $options = 0 ) {
		parent::__construct( $directory, $options );
		$this->options = $options;
	}

	public function write( $key, $content ) {
		$dir = dirname( $key );
		if ( ! is_dir( $dir ) ) {
			if ( false === @mkdir( $dir, 0777, true ) && ! is_dir( $dir ) ) {
				throw new RuntimeException( sprintf( 'Unable to create the cache directory (%s).', $dir ) );
			}
		} elseif ( ! is_writable( $dir ) ) {
			throw new RuntimeException( sprintf( 'Unable to write in the cache directory (%s).', $dir ) );
		}

		if ( false !== @file_put_contents( $key, $content ) ) {
			@chmod( $key, 0666 & ~umask() );

			if ( self::FORCE_BYTECODE_INVALIDATION == ( $this->options & self::FORCE_BYTECODE_INVALIDATION ) ) {
				// Compile cached file into bytecode cache
				if ( function_exists( 'opcache_invalidate' ) ) {
					opcache_invalidate( $key, true );
				} elseif ( function_exists( 'apc_compile_file' ) ) {
					apc_compile_file( $key );
				}
			}

			return;
		}

		throw new RuntimeException( sprintf( 'Failed to write cache file "%s".', $key ) );
	}

}