<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/18/18
 * Time: 10:46 AM
 */

abstract class Brizy_Editor_Asset_AbstractStorage {

	/**
	 * @var Brizy_Editor_Project
	 */
	protected $project;


	/**
	 * @var Brizy_Editor_Post
	 */
	protected $post;

	/**
	 * @var array
	 */
	protected $config;

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	protected $url_builder;

	/**
	 * Brizy_Editor_Asset_AbstractStorage constructor.
	 *
	 * @param $project
	 * @param $post
	 * @param $config
	 */
	public function __construct( $project, $post, $config ) {
		$this->project     = $project;
		$this->post        = $post;
		$this->config      = $config;
		$this->url_builder = new Brizy_Editor_UrlBuilder( $project, $post );
	}


	/**
	 * Get the asset and store it somewhere in uploads and return the new local url.
	 *
	 * @param $asset_url
	 *
	 * @return mixed
	 */
	abstract public function store( $asset_url );

	/**
	 * @param $asset_source
	 * @param $asset_path
	 *
	 * @return bool
	 */
	public function store_file( $asset_source, $asset_path ) {

		$full_asset_path = null;
		try {
			// check destination dir
			$dir_path = dirname( $asset_path );

			if ( ! file_exists( $dir_path ) ) {
				mkdir( $dir_path, 0777, true );
			}

			$full_asset_path = $asset_path;

			$fasset_dest = fopen( $asset_path, 'w' );
			if ( ! $fasset_dest ) {
				throw new Exception( 'Invalid file destination.' );
			}

			$fasset_src = fopen( $asset_source, 'r' );
			if ( ! $fasset_src ) {
				throw new Exception( 'Invalid asset source.' );
			}

			$buffer_length = 81920; // we can tune this later;

			while ( ! feof( $fasset_src ) ) {
				$buffer = fread( $fasset_src, $buffer_length );
				fwrite( $fasset_dest, $buffer );
			}

			fclose( $fasset_src );
			fclose( $fasset_dest );

		} catch ( Exception $e ) {
			$t = 0;

			// clean up
			if ( $full_asset_path ) {
				@unlink( $full_asset_path );
			}

			return false;
		}

		return true;
	}
}