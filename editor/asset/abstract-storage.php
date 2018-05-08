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

		if ( file_exists( $asset_path ) ) {
			return true;
		}

		try {
			// check destination dir
			$dir_path = dirname( $asset_path );

			if ( ! file_exists( $dir_path ) ) {
				mkdir( $dir_path, 0777, true );
			}


			$http        = new WP_Http();
			$wp_response = $http->request( $asset_source );

			if ( is_wp_error( $wp_response ) ) {
				return false;
			}

			$content = wp_remote_retrieve_body( $wp_response );

			file_put_contents( $asset_path, $content );

		} catch ( Exception $e ) {
			$t = 0;

			// clean up
			if ( $asset_path ) {
				@unlink( $asset_path );
			}

			return false;
		}

		return true;
	}


	/**
	 * Make sure the $asset_path is an existing file.
	 *
	 * @param $asset_path
	 * @param $post_id
	 * @param string $title
	 *
	 * @return bool|int
	 */
	public function attach_to_post( $asset_path, $post_id, $title = '' ) {

		if ( ! $post_id ) {
			return false;
		}
		if ( ! file_exists( $asset_path ) ) {
			return false;
		}

		$filetype = wp_check_filetype( $asset_path );

		$attachment = array(
			'post_mime_type' => $filetype['type'],
			'post_title'     => $title ? $title : basename( $asset_path ),
			'post_content'   => '',
			'post_status'    => 'inherit'
		);

		$result = wp_insert_attachment( $attachment, $asset_path, $post_id );

		if ( is_wp_error( $result ) ) {
			return false;
		}

		return $result;
	}
}