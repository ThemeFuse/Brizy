<?php

class Brizy_Editor_CropCacheMedia extends Brizy_Editor_Asset_StaticFile {

	use Brizy_Editor_Asset_AttachmentAware;

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	private $url_builder;

	/**
	 * Brizy_Editor_CropCacheMedia constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 */
	public function __construct( $project ) {
		$this->url_builder = new Brizy_Editor_UrlBuilder( $project );
	}

	/**
	 * @param $madia_name
	 * @param bool $ignore_wp_media
	 *
	 * @return false|string
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	public function download_original_image( $madia_name, $ignore_wp_media = true ) {

		// Check if user is querying API
		if ( ! $madia_name ) {
			Brizy_Logger::instance()->error( 'Empty media file provided' );
			throw new InvalidArgumentException( "Invalid media file" );
		}

		if ( $ignore_wp_media && strpos( $madia_name, "wp-" ) === 0 ) {
			Brizy_Logger::instance()->error( 'Invalid try to download wordpress file from application server' );
			throw new InvalidArgumentException( "Invalid media file" );
		}

		$external_asset_url = $this->url_builder->external_media_url( "iW=5000&iH=any/" . $madia_name );

		if ( ! ( $attachmentId = $this->getAttachmentByMediaName( $madia_name ) ) ) {

			// /var/www/html/wp-content/uploads/2021/09/mediaName.png
			$original_asset_path          = $this->url_builder->wp_upload_path( $madia_name );
			// 2021/09/mediaName.png
			$original_asset_path_relative = $this->url_builder->wp_upload_relative_path( $madia_name );

			if ( ! file_exists( $original_asset_path ) ) {
				// I assume that the media was already attached.

				if ( ! $this->store_file( $external_asset_url, $original_asset_path ) ) {
					// unable to save the attachment
					Brizy_Logger::instance()->error( 'Unable to store original media file', [
						'source'      => $external_asset_url,
						'destination' => $original_asset_path
					] );

					throw new Exception( 'Unable to cache media' );
				}
			}

			$attachmentId = $this->create_attachment( $madia_name, $original_asset_path, $original_asset_path_relative, null, $madia_name );
		}

		if ( $attachmentId === 0 || is_wp_error( $attachmentId ) ) {
			Brizy_Logger::instance()->error( 'Unable to attach media file', [ 'media' => $external_asset_url ] );
			throw new Exception( 'Unable to attach media' );
		}

		return get_attached_file( $attachmentId );
	}

	/**
	 * @param $original
	 * @param $size
	 *
	 * @return string|null
	 * @throws Exception
	 */
	public function crop_media( $originalPath, $size ) {

		if ( ! $size ) {
			throw new InvalidArgumentException( "Invalid crop filter" );
		}

		if ( ! $originalPath ) {
			throw new InvalidArgumentException( "Invalid crop filter" );
		}

		$resizedImgPath = $this->getResizedMediaPath( $originalPath, $size );

		if ( file_exists( $resizedImgPath ) ) {
			return $resizedImgPath;
		}

		$cropPath = $this->url_builder->brizy_upload_path( 'imgs/' );

		if ( ! wp_mkdir_p( $cropPath ) ) {
			throw new RuntimeException( sprintf( 'Directory "%s" was not created', $cropPath ) );
		}

		$cropper = new Brizy_Editor_Asset_Crop_Cropper();

		if ( ! $cropper->crop( $originalPath, $resizedImgPath, $size ) ) {
			return $originalPath;
		}

		return $resizedImgPath;
	}

	/**
	 * @throws Exception
	 */
	public function tryOptimizedPath( $originalPath, $size, $postId ) {

		$urlBuilder         = new Brizy_Editor_UrlBuilder( Brizy_Editor_Project::get(), $postId );
		$resized_image_path = $this->buildPath( $urlBuilder->page_upload_path( "/assets/images/" . $size ), $this->basename( $originalPath ) );
		$optimizedPath      = $this->buildPath( dirname( $resized_image_path ), 'optimized', $this->basename( $resized_image_path ) );

		if ( file_exists( $optimizedPath ) ) {
			return $optimizedPath;
		}

		$croppedPath = $this->getResizedMediaPath( $originalPath, $size );

		if ( ! file_exists( $croppedPath ) ) {
			throw new Exception( 'The image was not cropped yet.' );
		}

		return $croppedPath;
	}

	/**
	 * @param $originalPath
	 * @param $size
	 *
	 * @return string
	 */
	public function getResizedMediaPath( $originalPath, $size ) {

		$pathinfo = pathinfo( $originalPath );
		// iW=555&iH=451&oX=0&oY=0&cW=555&cH=451
		// car-red-555x451x0x0x555x451x1627570218.jpg
		// iW=594&iH=any
		// car-red-594xanyx1627570218.jpeg
		$size = strtolower( $size );
		$size = str_replace( [ 'iw=', 'ih=', 'ox=', 'oy=', 'cw=', 'ch=' ], '', $size );
		$size = str_replace( '&', 'x', $size );

		$name = $pathinfo['filename'] . '-' . $size . 'x' . filemtime( $originalPath ) . '.' . $pathinfo['extension'];

		return $this->buildPath( $this->url_builder->brizy_upload_path( 'imgs' ), $name );
	}

	/**
	 * @throws Exception
	 */
	public function getOriginalPath( $hash ) {

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

		$file = get_attached_file( $id );

		if ( ! $file ) {
			throw new Exception( sprintf( 'File by id "%s" is not found.', $id ) );
		}

		if ( ! file_exists( $file ) ) {
			throw new Exception( sprintf( 'The file "%s" does not exist.', $file ) );
		}

		return $file;
	}

	public function basename( $originalPath ) {
		return preg_replace( '/^.+[\\\\\\/]/', '', $originalPath );
	}

	public function buildPath( ...$parts ) {
		return implode( DIRECTORY_SEPARATOR, $parts );
	}
}