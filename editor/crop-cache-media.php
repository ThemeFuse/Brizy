<?php

class Brizy_Editor_CropCacheMedia extends Brizy_Editor_Asset_StaticFile {

	use Brizy_Editor_Asset_AttachmentAware;

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
	 * @param $original
	 * @param $sizes
	 *
	 * @return string|null
	 * @throws Exception
	 */
	public function crop_media( $original, $sizes ) {

		if ( ! $sizes ) {
			throw new InvalidArgumentException( "Invalid crop filter" );
		}

		if ( ! $original ) {
			throw new InvalidArgumentException( "Invalid crop filter" );
		}

		if ( ( $img = $this->getOldPath( $original, $sizes ) ) && file_exists( $img ) ) {
			return $img;
		}

		$resizedImgPath = $this->getResizedMediaPath( $original, $sizes );

		if ( file_exists( $resizedImgPath ) ) {
			return $resizedImgPath;
		}

		$cropPath = $this->url_builder->brizy_upload_path( 'imgs/' );

		if ( ! wp_mkdir_p( $cropPath ) ) {
			throw new RuntimeException( sprintf( 'Directory "%s" was not created', $cropPath ) );
		}

		$cropper = new Brizy_Editor_Asset_Crop_Cropper();

		if ( ! $cropper->crop( $original, $resizedImgPath, $sizes ) ) {
			return $original;
		}

		return $resizedImgPath;
	}

	public function getOldPath( $original_asset_path, $media_filter ) {

		$resized_image_path        = $this->buildPath( $this->url_builder->page_upload_path( "/assets/images/" . $media_filter ), $this->basename( $original_asset_path ) );
		$optimized_image_full_path = $this->buildPath( dirname( $resized_image_path ), 'optimized', $this->basename( $resized_image_path ) );

		if ( file_exists( $optimized_image_full_path ) ) {
			return $optimized_image_full_path;
		} elseif ( file_exists( $resized_image_path ) ) {
			return $resized_image_path;
		}

		return null;
	}

	/**
	 * @param $original
	 * @param $sizes
	 *
	 * @return string
	 */
	public function getResizedMediaPath( $original, $sizes ) {

		$pathinfo = pathinfo( $original );
		// iW=555&iH=451&oX=0&oY=0&cW=555&cH=451
		// car-red-555x451x0x0x555x451x1627570218.jpg
		// iW=594&iH=any
		// car-red-594xanyx1627570218.jpeg
		$sizes = str_replace( '&', 'x', $sizes );

		$name = $pathinfo['filename'] . '-' . $sizes . 'x' . filemtime( $original ) . '.' . $pathinfo['extension'];

		return $this->buildPath( $this->url_builder->brizy_upload_path( 'imgs' ), $name );
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

	public function basename( $original_asset_path ) {
		return preg_replace( '/^.+[\\\\\\/]/', '', $original_asset_path );
	}

	public function buildPath( ...$parts ) {
		return implode( DIRECTORY_SEPARATOR, $parts );
	}
}