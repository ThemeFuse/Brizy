<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/18/18
 * Time: 10:46 AM
 */

class Brizy_Editor_Asset_Storage {

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;


	/**
	 * @var Brizy_Editor_Post
	 */
	private $post;

	/**
	 * @var array
	 */
	private $config;

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	private $url_builder;

	/**
	 * Brizy_Editor_Asset_Storage constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
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
	public function store( $asset_url ) {

		$asset_url = html_entity_decode($asset_url);

		if ( $this->isEditorUrl( $asset_url ) ) {
			$sufix_url     = $this->getAssetPart( $asset_url, $this->config['urls']['assets'] );
			$tmp_asset_url = $this->url_builder->editor_asset_path( $sufix_url );
			$new_url       = $this->url_builder->upload_url( $tmp_asset_url );
			$new_path      = $this->url_builder->upload_path( $tmp_asset_url );

			if ( $this->store_file( $asset_url, $new_path ) ) {
				$asset_url = $new_url;
			}

		}

		if ( $this->isStaticUrl( $asset_url ) ) {
			$sufix_url     = $this->getAssetPart( $asset_url, $this->config['urls']['static'] );
			$tmp_asset_url = $this->url_builder->page_asset_path( $sufix_url );
			$new_url       = $this->url_builder->upload_url( $tmp_asset_url );
			$new_path      = $this->url_builder->upload_path( $tmp_asset_url );

			if ( $this->store_file( $asset_url, $new_path ) ) {
				$asset_url = $new_url;
			}
		}

		if ( $this->isMediaUrl( $asset_url ) ) {
			$sufix_url     = $this->getAssetPart( $asset_url, $this->config['urls']['image'] );
			$tmp_asset_url = $this->url_builder->media_asset_path( $sufix_url );
			$new_url       = $this->url_builder->upload_url( $tmp_asset_url );
			$new_path      = $this->url_builder->upload_path( $tmp_asset_url );

			if ( $this->store_file( $asset_url, $new_path ) ) {
				$asset_url = $new_url;
			}
		}

		return $asset_url;
	}

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

	/**
	 * @param $url
	 *
	 * @return bool
	 */
	public function isStaticUrl( $url ) {
		return strpos( $url, $this->config['urls']['static'] ) === 0;
	}

	public function getAssetPart( $url, $prefix ) {
		return str_replace( $prefix, '', $url );
	}

	/**
	 * @param $url
	 *
	 * @return bool
	 */
	public function isEditorUrl( $url ) {
		return strpos( $url, $this->config['urls']['assets'] ) === 0;
	}

	/**
	 * @param $url
	 *
	 * @return bool
	 */
	public function isMediaUrl( $url ) {
		return strpos( $url, $this->config['urls']['image'] ) === 0;
	}

}