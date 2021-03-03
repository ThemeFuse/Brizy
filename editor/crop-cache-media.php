<?php

class Brizy_Editor_CropCacheMedia extends Brizy_Editor_Asset_StaticFile {

	use Brizy_Editor_Asset_AttachmentAware;

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
	public function __construct( $project, $post_id = null ) {

		$this->post_id     = $post_id;
		$this->url_builder = new Brizy_Editor_UrlBuilder( $project, $this->post_id );
	}

	/**
	 * @param $madia_name
	 * @param bool $ignore_wp_media
	 *
	 * @return false|string
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function download_original_image( $madia_name, $ignore_wp_media=true ) {

		// Check if user is querying API
		if ( ! $madia_name ) {
			Brizy_Logger::instance()->error( 'Empty media file provided' );
			throw new InvalidArgumentException( "Invalid media file" );
		}

		if ( $ignore_wp_media && strpos( $madia_name, "wp-" ) === 0 ) {
			Brizy_Logger::instance()->error( 'Invalid try to download wordpress file from application server' );
			throw new InvalidArgumentException( "Invalid media file" );
		}

		$attachmentId       = null;
		$external_asset_url = $this->url_builder->external_media_url( "iW=5000&iH=any/" . $madia_name );

		if ( ! ( $attachmentId = $this->getAttachmentByMediaName( $madia_name ) ) ) {

			$original_asset_path          = $this->url_builder->page_upload_path( "/assets/images/" . $madia_name );
			$original_asset_path_relative = $this->url_builder->page_upload_relative_path( "/assets/images/" . $madia_name );

			if ( ! file_exists( $original_asset_path ) ) {
				// I assume that the media was already attached.

				if ( ! $this->store_file( $external_asset_url, $original_asset_path ) ) {
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
		$resized_page_asset_path = $this->url_builder->page_upload_path( "/assets/images/" . $media_filter );


		return $resized_page_asset_path . "/" . $this->basename( $original_asset_path );
	}

	/**
	 * @param $original_asset_path
	 * @param $media_filter
	 * @param bool $force_crop
	 *
	 * @return string
	 * @throws Exception
	 */
	public function crop_media( $original_asset_path, $media_filter, $force_crop = true, $force_optimize = false ) {

		// Check if user is querying API
		if ( ! file_exists( $original_asset_path ) ) {
			throw new InvalidArgumentException( "Invalid media file" );
		}

		if ( ! $media_filter ) {
			throw new InvalidArgumentException( "Invalid crop filter" );
		}

		$resized_page_asset_path = $this->url_builder->page_upload_path( "/assets/images/" . $media_filter );
		$resized_image_path      = $this->getResizedMediaPath( $original_asset_path, $media_filter );

		$optimized_image_path_dir  = dirname( $resized_image_path ) . DIRECTORY_SEPARATOR . 'optimized';
		$optimized_image_full_path = $optimized_image_path_dir . DIRECTORY_SEPARATOR . $this->basename( $resized_image_path );

		$hq_image_path_dir  = dirname( $resized_image_path ) . DIRECTORY_SEPARATOR . 'hq';
		$hq_image_full_path = $hq_image_path_dir . DIRECTORY_SEPARATOR . $this->basename( $resized_image_path );

		if ( file_exists( $optimized_image_full_path ) ) {
			return $optimized_image_full_path;
		}

		// resize image with default wordpress settings
		$wp_file_exists = file_exists( $resized_image_path );
		if ( ! $wp_file_exists ) {

			if ( ! $force_crop ) {
				throw new Exception( 'Crop not forced.' );
			}

			if ( !file_exists( $resized_page_asset_path ) && ! @mkdir( $resized_page_asset_path, 0755, true ) && ! is_dir( $resized_page_asset_path ) ) {
				throw new \RuntimeException( sprintf( 'Directory "%s" was not created', $resized_page_asset_path ) );
			}

			$cropper = new Brizy_Editor_Asset_Crop_Cropper();

			if ( ! $cropper->crop( $original_asset_path, $resized_image_path, $media_filter ) ) {
				throw new Exception( 'Failed to crop image.' );
			}
		}

		// resize image for optimization
		$hq_wp_file_exists = file_exists( $hq_image_full_path );
		$closure           = null;
		if ( $force_optimize && ! $hq_wp_file_exists ) {
			$closure = function ( $t ) {
				return 100;
			};
			add_filter( 'jpeg_quality', $closure );

			if ( !file_exists( $hq_image_path_dir ) && ! @mkdir( $hq_image_path_dir, 0755, true ) && ! is_dir( $hq_image_path_dir ) ) {
				throw new \RuntimeException( sprintf( 'Directory "%s" was not created', $hq_image_path_dir ) );
			}

			$cropper = new Brizy_Editor_Asset_Crop_Cropper();

			if ( ! $cropper->crop( $original_asset_path, $hq_image_full_path, $media_filter ) ) {
				throw new Exception( 'Failed to crop image with 100%.' );
			}
		}

		// try to optimize the image
		$hq_wp_file_exists = file_exists( $hq_image_full_path );
		if ( $force_optimize && $hq_wp_file_exists ) {
			$optimizer = new Brizy_Editor_Asset_Optimize_Optimizer();
			if ( !file_exists( $optimized_image_path_dir ) && ! @mkdir( $optimized_image_path_dir, 0755, true ) && ! is_dir( $optimized_image_path_dir ) ) {
				throw new \RuntimeException( sprintf( 'Directory "%s" was not created', $optimized_image_path_dir ) );
			}

			if ( $optimizer->optimize( $hq_image_full_path, $optimized_image_full_path ) ) {
				$resized_image_path = $optimized_image_full_path;
			} else {
				throw new Exception( 'Failed to optimize the image.' );
			}

		}

		// remove jpeg_quality and try to delete the hq image
		if ( $hq_wp_file_exists ) {
			remove_filter( 'jpeg_quality', $closure );
			@unlink( $hq_image_full_path );
		}

		return $resized_image_path;
	}

	public function basename( $original_asset_path ) {
		return preg_replace( '/^.+[\\\\\\/]/', '', $original_asset_path );
	}

	/**
	 * Do not remove this function!!! it is used in other plugins like Rank Math
	 *
	 * @param $url
	 *
	 * @return string|string[]|null
	 * @throws Exception
	 */
	public function get_static_url( $url ) {

		$url   = Brizy_SiteUrlReplacer::restoreSiteUrl( $url );
		$query = parse_url( $url, PHP_URL_QUERY );

		if ( empty( $query ) ) {
			return $url;
		}

		parse_str( $query, $query );

		$media  = $query[ Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT ) ];
		$filter = $query[ Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT_FILTER ) ];
		$post   = $query[ Brizy_Editor::prefix( Brizy_Public_CropProxy::ENDPOINT_POST ) ];

		if ( empty( $media ) ) {
			return $url;
		}

		try {
			$mediaUrl = $this->getMediaUrl( $media );
		} catch ( Exception $e ) {
			return $url;
		}

		$this->url_builder->set_post_id( $post );

		$crop = new self( Brizy_Editor_Project::get(), $post );

		return str_replace( $this->url_builder->upload_path(), $this->url_builder->upload_url(), $crop->crop_media( $mediaUrl, $filter ) );
	}

	public function getMediaUrl( $hash ) {

		$id = null;

		if ( is_numeric( $hash ) ) {
			$id = $hash;
		} else {
			$attachments = get_posts( [
				'meta_key'       => 'brizy_attachment_uid',
				'meta_value'     => $hash,
				'post_type'      => 'attachment',
				'fields'         => 'ids',
				'posts_per_page' => 1
			] );

			if ( isset( $attachments[0] ) ) {
				$id = $attachments[0];
			}
		}

		if ( ! $id ) {
			throw new Exception( 'Media not found' );
		}

		return get_attached_file( $id );
	}
}