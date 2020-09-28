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
	 * @var string
	 */
	private $media_path;

	/**
	 * @var string
	 */
	private $filter;

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Editor_Post
	 */
	private $post_id;

	/**
	 * Brizy_Editor_CropCacheMedia constructor.
	 *
	 * @param $project
	 * @param $post_id
	 * @param string $media_path
	 * @param string $filter
	 */
	public function __construct( $project, $post_id, $media_path = '', $filter = '' ) {

		$this->media_path  = $media_path;
		$this->filter      = $filter;
		$this->post_id     = $post_id;
		$this->project     = $project;
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
	 * @return string
	 */
	public function getResizedMediaPath() {
		return $this->url_builder->page_upload_path( "/assets/images/" . $this->filter ) . "/" . basename( $this->media_path );
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
	}

	public function crop_local() {

		$resized_image_path = $this->getResizedMediaPath();

		if ( file_exists( $resized_image_path ) ) {
			return $resized_image_path;
		}

		$resized_page_asset_path = $this->url_builder->page_upload_path( "/assets/images/" . $this->filter );

		if ( ! file_exists( $resized_page_asset_path ) && ! @mkdir( $resized_page_asset_path, 0755, true ) && ! is_dir( $resized_page_asset_path ) ) {
			throw new \RuntimeException( sprintf( 'Directory "%s" was not created', $resized_page_asset_path ) );
		}

		$cropper = new Brizy_Editor_Asset_Crop_Cropper();

		if ( ! $cropper->crop( $this->media_path, $resized_image_path, $this->filter ) ) {
			throw new Exception( 'Failed to crop image.' );
		}

		return $resized_image_path;
	}

    private function crop_local_hq() {
	    $resized_image_path        = $this->getResizedMediaPath();
	    $hq_image_path_dir         = dirname( $resized_image_path ) . DIRECTORY_SEPARATOR . 'hq';
	    $hq_image_full_path        = $hq_image_path_dir . DIRECTORY_SEPARATOR . basename( $resized_image_path );
	    $closure                   = function ( $t ) { return 100; };

	    if ( file_exists( $hq_image_full_path ) ) {
	    	return $hq_image_full_path;
	    }

	    add_filter( 'jpeg_quality', $closure );

	    if ( ! file_exists( $hq_image_path_dir ) && ! @mkdir( $hq_image_path_dir, 0755, true ) && ! is_dir( $hq_image_path_dir ) ) {
		    throw new \RuntimeException( sprintf( 'Directory "%s" was not created', $hq_image_path_dir ) );
	    }

	    $cropper = new Brizy_Editor_Asset_Crop_Cropper();

	    if ( ! $cropper->crop( $this->media_path, $hq_image_full_path, $this->filter ) ) {
		    throw new Exception( 'Failed to crop image with 100%.' );
	    }

	    remove_filter( 'jpeg_quality', $closure );

	    return $hq_image_full_path;
    }

	public function optimize( $optimize ) {
		$optimized_image_full_path = $this->get_optimized_img_full_path();

		if ( file_exists( $optimized_image_full_path ) ) {
			return $optimized_image_full_path;
		}

		if ( ! $optimize && $this->is_shortpixel() ) {
			throw new Exception('Images should be optimized from the admin.');
		}

		try {
			$resized_image_path = $optimize ? $this->crop_local_hq() : $this->crop_local();
		} catch ( Exception $e ) {
			return $this->media_path;
		}

		if ( ! file_exists( $resized_image_path ) ) {
			throw new Exception( 'Cropped image was not saved.' );
		}

		$optimizer                 = new Brizy_Editor_Asset_Optimize_Optimizer();
		$optimized_image_path_dir  = dirname( $optimized_image_full_path );

		if ( ! file_exists( $optimized_image_path_dir ) && ! wp_mkdir_p( $optimized_image_path_dir ) && ! is_dir( $optimized_image_path_dir ) ) {
			throw new \RuntimeException( sprintf( 'Directory "%s" was not created', $optimized_image_path_dir ) );
		}

		if ( $optimizer->optimize( $resized_image_path, $optimized_image_full_path ) ) {
			$resized_image_path = $optimized_image_full_path;
		} else {
			throw new Exception( 'Failed to optimize the image.' );
		}

		return $resized_image_path;
	}

	public function get_optimized_img_full_path() {
		$resized_image_path       = $this->getResizedMediaPath();
		$pathinfo                 = pathinfo( $resized_image_path );
		$optimizedFolder          = $this->is_shortpixel() ? 'shortpixel' : 'optimized';
		$extension                = $this->is_shortpixel() ? $pathinfo['extension'] : 'webp';
		$optimized_image_path_dir = dirname( $resized_image_path ) . DIRECTORY_SEPARATOR . $optimizedFolder;

		return $optimized_image_path_dir . DIRECTORY_SEPARATOR . $pathinfo['filename'] . '.' . $extension;
	}

	public function have_optimizer() {

		return ( $this->project->getImageOptimizerSettings( Brizy_Editor_Asset_Optimize_BunnyCdnOptimizer::getId(), 'active' ) && $this->support_webp() ) ||
		       $this->project->getImageOptimizerSettings( Brizy_Editor_Asset_Optimize_ShortpixelOptimizer::getId(), 'active' );
	}

	public function is_shortpixel() {
		return $this->project->getImageOptimizerSettings( Brizy_Editor_Asset_Optimize_ShortpixelOptimizer::getId(), 'active' );
	}

	public function support_webp() {
		return strpos( $_SERVER['HTTP_ACCEPT'], 'image/webp' ) !== false;
	}
}