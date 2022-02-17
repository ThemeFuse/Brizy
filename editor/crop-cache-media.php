<?php

class Brizy_Editor_CropCacheMedia extends Brizy_Editor_Asset_StaticFile {

	use Brizy_Editor_Asset_AttachmentAware;

	/**
	 * @var Brizy_Editor_UrlBuilder
	 */
	private $url_builder;

	private static $imgs = [];

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
	public function crop_media( $uid, $size ) {

		$resizedImgPath = $this->getImgPath( $uid, $size );

		if ( file_exists( $resizedImgPath ) ) {
			return $resizedImgPath;
		}

		$cropPath = $this->url_builder->brizy_upload_path( 'imgs/' );

		if ( ! wp_mkdir_p( $cropPath ) ) {
			throw new RuntimeException( sprintf( 'Directory "%s" was not created', $cropPath ) );
		}

		$cropper      = new Brizy_Editor_Asset_Crop_Cropper();
		$originalPath = $this->getOriginalPath( $uid );

		if ( ! $cropper->crop( $originalPath, $resizedImgPath, $size, $this->getOrignalImgSizes( $uid ) ) ) {
			return $originalPath;
		}

		return $resizedImgPath;
	}

	/**
	 * @throws Exception
	 */
	public function getImgPath( $uid, $size ) {

		if ( array_key_exists( $size, Brizy_Editor::get_all_image_sizes() ) ) {
			return $this->getImgPathByWpSize( $uid, $size );
		}

		$originalPath = $this->getOriginalPath( $uid );
		$cropper      = new Brizy_Editor_Asset_Crop_Cropper();
		$options      = $cropper->getFilterOptions( $originalPath, $size, $this->getOrignalImgSizes( $uid ) );

		if (
			$options['is_advanced'] === false
			&&
			$options['requestedData']['imageWidth'] > $options['originalSize'][0]
			&&
			in_array( $options['requestedData']['imageHeight'], [ 'any', '*', '0' ] )
		) {
			return $originalPath;
		}

		$pathinfo     = pathinfo( $originalPath );
		$size         = strtolower( $size );
		$size         = str_replace( [ 'iw=', 'ih=', 'ox=', 'oy=', 'cw=', 'ch=' ], '', $size );
		$size         = str_replace( '&', 'x', $size );
		$name         = $pathinfo['filename'] . '-' . $size . 'x' . filemtime( $originalPath ) . '.' . $pathinfo['extension'];

		return $this->buildPath( $this->url_builder->brizy_upload_path( 'imgs' ), $name );
	}

	/**
	 * @throws Exception
	 */
	public function getImgUrl( $uid, $size ) {
		if ( array_key_exists( $size, Brizy_Editor::get_all_image_sizes() ) ) {
			return $this->getImgUrlByWpSize( $uid, $size );
		}

		$originalPath = $this->getOriginalPath( $uid );
		$imgPath      = $this->getImgPath( $uid, $size );

		if ( $originalPath === $imgPath ) {
			return $this->getImgUrlByWpSize( $uid, 'full' );
		}

		if ( ! file_exists( $imgPath ) ) {
			throw new Exception( 'The image is not cropped yet' );
		}

		return str_replace( $this->url_builder->upload_path(), $this->url_builder->upload_url(), $imgPath );
	}

	/**
	 * @throws Exception
	 */
	public function getOriginalPath( $uid ) {

		$id   = $this->getAttachmentId( $uid );
		$file = get_attached_file( $id );

		if ( ! $file ) {
			throw new Exception( sprintf( 'File by id "%s" is not found.', $id ) );
		}

		if ( ! file_exists( $file ) ) {
			throw new Exception( sprintf( 'The file "%s" does not exist.', $file ) );
		}

		return $file;
	}

	/**
	 * @throws Exception
	 */
	private function getAttachmentId( $uid ) {

		if ( is_numeric( $uid ) ) {
			return $uid;
		}

		if ( isset( self::$imgs[ $uid ] ) ) {
			return self::$imgs[ $uid ]->ID;
		}

		global $wpdb;

		$imgId = $wpdb->get_var( $wpdb->prepare( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key=%s AND meta_value=%s", 'brizy_attachment_uid', $uid ) );

		if ( ! $imgId ) {
			throw new Exception( sprintf( 'There is no image with the uid "%s"', $uid ) );
		}

		self::$imgs[ $uid ] = (object)[ 'ID' => $imgId ];

		return $imgId;
	}

	/**
	 * @throws Exception
	 */
	private function getOrignalImgSizes( $uid ) {

		$sizes = wp_get_attachment_image_src( $this->getAttachmentId( $uid ), 'full' );

		return [ $sizes[1], $sizes[2] ];
	}

	public function cacheImgs( $uids ) {

		global $wpdb;

		$uids = array_diff( array_unique( $uids ), array_keys( self::$imgs ) );

		if ( ! $uids ) {
			return;
		}

		$sql = "SELECT m.meta_value, p.ID FROM {$wpdb->posts} p INNER JOIN {$wpdb->postmeta} m ON ( p.ID = m.post_id ) WHERE m.meta_key = 'brizy_attachment_uid' AND m.meta_value IN (" . implode( ', ', array_fill( 0, count( $uids ), '%s' ) ) . ") AND p.post_type = 'attachment' ORDER BY p.post_date DESC";

		$imgs = $wpdb->get_results( $wpdb->prepare( $sql, $uids ), OBJECT_K );

		if ( ! $imgs ) {
			return;
		}

		self::$imgs = array_merge( self::$imgs, $imgs );
	}

	/**
	 * @throws Exception
	 */
	private function getImgUrlByWpSize( $uid, $size ) {
		$size   = $size == 'original' ? 'full' : $size;
		$imgUrl = wp_get_attachment_image_url( $this->getAttachmentId( $uid ), $size );

		if ( ! $imgUrl && $size != 'full' ) {
			$imgUrl = $this->getImgUrlByWpSize( $uid, 'full' );
		}

		return $imgUrl;
	}

	/**
	 * @throws Exception
	 */
	private function getImgPathByWpSize( $uid, $size ) {

		$imgPath = str_replace( $this->url_builder->upload_url(), $this->url_builder->upload_path(), $this->getImgUrlByWpSize( $uid, $size ) );

		if ( ! file_exists( $imgPath ) ) {
			throw new Exception( sprintf( 'The image with uid %s has no this wp size %s', $uid, $size ) );
		}

		return $imgPath;
	}

	public function basename( $originalPath ) {
		return preg_replace( '/^.+[\\\\\\/]/', '', $originalPath );
	}

	public function buildPath( ...$parts ) {
		return implode( DIRECTORY_SEPARATOR, $parts );
	}
}