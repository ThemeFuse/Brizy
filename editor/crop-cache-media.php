<?php

class Brizy_Editor_CropCacheMedia extends Brizy_Editor_Asset_StaticFile {

	const BASIC_CROP_TYPE = 1;
	const ADVANCED_CROP_TYPE = 2;

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	private $url_builder;

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post_id;

	/**
	 * Brizy_Editor_CropCacheMedia constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 * @param int $post_id
	 */
	public function __construct( $project, $post_id ) {

		$this->post_id     = $post_id;
		$this->url_builder = new Brizy_Editor_UrlBuilder( $project, $this->post_id );
	}

	/**
	 * @param $madia_name
	 *
	 * @return string
	 * @throws Exception
	 */
	public function download_original_image( $madia_name ) {

		// Check if user is querying API
		if ( ! $madia_name ) {
			Brizy_Logger::instance()->error( 'Empty media file provided' );
			throw new InvalidArgumentException( "Invalid media file" );
		}

		if ( strpos( $madia_name, "wp-" ) === 0 ) {
			Brizy_Logger::instance()->error( 'Invalid try to download wordpress file from application server' );
			throw new InvalidArgumentException( "Invalid media file" );
		}

		$attachmentId       = null;
		$external_asset_url = $this->url_builder->external_media_url( "iW=5000&iH=any/" . $madia_name );
		$fs                 = Brizy_Admin_FileSystem::instance();

		$original_asset_path          = $this->url_builder->page_upload_path( "/assets/images/" . $madia_name );
		$original_asset_path_relative = $this->url_builder->page_upload_relative_path( "/assets/images/" . $madia_name );

		if ( ! ( $attachmentId = $this->getAttachmentByMediaName( $madia_name ) ) ) {

			if ( ! $fs->has( $original_asset_path_relative ) ) {
				// I assume that the media was already attached.

				if ( ! $this->store_file( $external_asset_url, $original_asset_path_relative ) ) {
					// unable to save the attachment
					Brizy_Logger::instance()->error( 'Unable to store original media file', array(
						'source'      => $external_asset_url,
						'destination' => $original_asset_path
					) );
					throw new Exception( 'Unable to cache media' );
				}
			}

			$attachmentId = $this->create_attachment( $madia_name, $original_asset_path, $original_asset_path_relative, $this->post_id, $madia_name );
		}

		if ( $attachmentId === 0 || is_wp_error( $attachmentId ) ) {
			Brizy_Logger::instance()->error( 'Unable to attach media file', array(
				'media'       => $external_asset_url,
				'parent_post' => $this->post_id

			) );
			throw new Exception( 'Unable to attach media' );
		}

		// move this attachment in FS
		if ( ! $fs->has( $original_asset_path_relative ) ) {
			$fs->loadFileInKey( $original_asset_path_relative, $original_asset_path );
		}

		// attach to post
		$this->attach_to_post( $attachmentId, $this->post_id, $madia_name );

		return get_attached_file( $attachmentId );
	}

	/**
	 * @param $original_asset_path
	 * @param $media_filter
	 * @param string $basenamePrefix
	 *
	 * @return string
	 */
	public function getResizedMediaPath( $original_asset_path, $media_filter ) {
		return $this->url_builder->page_upload_relative_path( "/assets/images/" . $media_filter . '/' . basename( $original_asset_path ) );
	}

	public function getOptimizedMediaPath( $original_asset_path, $media_filter ) {
		return $this->url_builder->page_upload_relative_path( "/assets/images/" . $media_filter . '/' . 'optimized' . '/' . basename( $original_asset_path ) );
	}

	public function getHQMediaPath( $original_asset_path, $media_filter ) {
		return $this->url_builder->page_upload_relative_path( "/assets/images/" . $media_filter . '/' . 'hq' . '/' . basename( $original_asset_path ) );
	}

	/**
	 * @param $original_asset_key
	 * @param $media_filter
	 * @param bool $force_crop
	 *
	 * @return string
	 * @throws Exception
	 */
	public function crop_media( $original_asset_key, $media_filter, $force_crop = true, $force_optimize = false ) {

		$fs = Brizy_Admin_FileSystem::instance();

		$resized_image_path        = $this->getResizedMediaPath( $original_asset_key, $media_filter );
		$optimized_image_full_path = $this->getOptimizedMediaPath( $original_asset_key, $media_filter );

		if ( $fs->has( $optimized_image_full_path ) ) {
			return $optimized_image_full_path;
		}

		if ( $hasResizedImagePath = $fs->has( $resized_image_path ) ) {
			return $resized_image_path;
		}

		// Check if user is querying API
		if ( ! $fs->has( $original_asset_key ) ) {
			throw new InvalidArgumentException( "Invalid media file" );
		}

		if ( ! $media_filter ) {
			throw new InvalidArgumentException( "Invalid crop filter" );
		}

		$hq_image_full_path = $this->getHQMediaPath($original_asset_key, $media_filter);
		$tmp_original_absolute_path = $this->url_builder->upload_path( time() . '-' . basename( $original_asset_key ) );


		// resize image with default wordpress settings
		if ( ! $hasResizedImagePath ) {

			if ( ! $force_crop ) {
				throw new Exception( 'Crop not forced.' );
			}

			$cropper              = new Brizy_Editor_Asset_Crop_Cropper();
			$resize_absolute_path = $this->url_builder->upload_path( time() . '-resized-' . basename( $original_asset_key ) );
			$fs->writeFileLocally( $original_asset_key, $tmp_original_absolute_path );
			if ( ! $cropper->crop( $tmp_original_absolute_path, $resize_absolute_path, $media_filter ) ) {
				throw new Exception( 'Failed to crop image.' );
			}
			$fs->loadFileInKey( $resized_image_path, $resize_absolute_path );

			@unlink( $resize_absolute_path );
			@unlink( $tmp_original_absolute_path );
		}


		// resize image for optimization
		// we must create a 100% quality image for optimization
		$closure          = null;
		$tmp_hq_absolute_path = $this->url_builder->upload_path( time() . '-resized-hd-' . basename( $original_asset_key ) );
		if ( $force_optimize && ! $fs->has( $hq_image_full_path ) ) {
			$closure = function ( $t ) {
				return 100;
			};
			add_filter( 'jpeg_quality', $closure );

			$cropper = new Brizy_Editor_Asset_Crop_Cropper();

			if ( ! file_exists( $tmp_original_absolute_path ) ) {
				$fs->writeFileLocally( $original_asset_key, $tmp_original_absolute_path );
			}

			if ( ! $cropper->crop( $tmp_original_absolute_path, $tmp_hq_absolute_path, $media_filter ) ) {
				throw new Exception( 'Failed to crop image with 100%.' );
			}
		}


		// try to optimize the image
		$tmp_hq_optimized_path = $this->url_builder->upload_path( time() . '-resized-hd-optimized' . basename( $original_asset_key ) );
		if ( $force_optimize && $fs->has( $hq_image_full_path ) ) {
			$optimizer = new Brizy_Editor_Asset_Optimize_Optimizer();

			if ( $optimizer->optimize( $tmp_hq_absolute_path, $tmp_hq_optimized_path ) ) {
				$fs->loadFileInKey( $optimized_image_full_path, $tmp_hq_optimized_path );
				$resized_image_path = $optimized_image_full_path;
			} else {
				throw new Exception( 'Failed to optimize the image.' );
			}

		}
		@unlink( $tmp_hq_optimized_path );
		@unlink( $tmp_hq_absolute_path );
		// remove jpeg_quality and try to delete the hq image
		if ( $force_optimize && ! $fs->has( $hq_image_full_path ) ) {
			remove_filter( 'jpeg_quality', $closure );
			@unlink( $hq_image_full_path );
		}

		return $resized_image_path;
	}

	/**
	 * @param $media_name
	 *
	 * @return null|string
	 */
	private function getAttachmentByMediaName( $media_name ) {

		global $wpdb;

		$pt = $wpdb->posts;
		$mt = $wpdb->postmeta;

		return $wpdb->get_var( $wpdb->prepare(
			"SELECT 
						{$pt}.ID
					FROM {$pt}
						INNER JOIN {$mt} ON ( {$pt}.ID = {$mt}.post_id )
					WHERE 
						( {$mt}.meta_key = 'brizy_attachment_uid' 
						AND {$mt}.meta_value = %s )
						AND {$pt}.post_type = 'attachment'
						AND {$pt}.post_status = 'inherit'
					GROUP BY {$pt}.ID
					ORDER BY {$pt}.post_date DESC",
			$media_name
		) );

	}
}
