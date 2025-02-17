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
	 * @param string $madia_name
	 *
	 * @return int
	 * @throws Exception
	 */
	public function download_original_image( $madia_name ) {

		if ( ! $madia_name ) {
			throw new InvalidArgumentException( 'Invalid media file' );
		}

		$external_asset_url = $this->url_builder->external_media_url( "iW=5000&iH=any/" . $madia_name );

		if ( ! ( $attachmentId = $this->getAttachmentByMediaName( $madia_name ) ) ) {

			$original_asset_path          = $this->url_builder->wp_upload_path( $madia_name );
			$original_asset_path_relative = $this->url_builder->wp_upload_relative_path( $madia_name );

			if ( ! file_exists( $original_asset_path ) && ! $this->store_file( $external_asset_url, $original_asset_path ) ) {
				throw new Exception( sprintf( 'Unable to cache media from source %s to %s', $external_asset_url, $original_asset_path ) );
			}

			$attachmentId = $this->create_attachment( $madia_name, $original_asset_path, $original_asset_path_relative, null, $madia_name );
		}

		if ( $attachmentId === 0 || is_wp_error( $attachmentId ) ) {
			$message = is_wp_error( $attachmentId ) ? $attachmentId->get_error_message() : sprintf( 'Unable to cache media from source %s', $external_asset_url );
			throw new Exception( $message );
		}

		return $attachmentId;
	}

	/**
	 * @param $uid
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

       $originalPath = apply_filters( 'brizy_after_cropped_img_path', $originalPath );

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

		$pathinfo = pathinfo( $originalPath );
		$size     = strtolower( $size );
		$size     = str_replace( [ 'iw=', 'ih=', 'ox=', 'oy=', 'cw=', 'ch=' ], '', $size );
		$size     = str_replace( '&', 'x', $size );
		$name     = $pathinfo['filename'] . '-' . $size . 'x' . filemtime( $originalPath ) . '.' . $pathinfo['extension'];

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
	public function getAttachmentId( $uid ) {

		if ( is_numeric( $uid ) ) {
			return $uid;
		}

		if ( isset( self::$imgs[ $uid ] ) ) {
			return self::$imgs[ $uid ]->ID;
		}

		$imgId = $this->getAttachmentByMediaName( $uid );

		if ( ! $imgId ) {
			throw new Exception( sprintf( 'There is no image with the uid "%s"', $uid ) );
		}

		self::$imgs[ $uid ] = (object) [ 'ID' => $imgId ];

		return $imgId;
	}

	/**
	 * @throws Exception
	 */
	private function getOrignalImgSizes( $uid ) {

		$attachment_id = $this->getAttachmentId( $uid );
		$sizes         = wp_get_attachment_image_src( $attachment_id, 'full' );
		if(is_array($sizes))
			return [ $sizes[1], $sizes[2] ];

		throw new \Exception('Unable to obtain image: '.$attachment_id);
	}

	public function cacheImgs( $uids ) {

		global $wpdb;

		$uids = array_filter( $uids, function ( $uid ) {
			return ! is_numeric( $uid );
		} );
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
		$size = $size == 'original' ? 'full' : $size;

		if ( $size == 'full' ) {
			$imgUrl = wp_get_attachment_url( $this->getAttachmentId( $uid ) );
		} else {
			$imgUrl = wp_get_attachment_image_url( $this->getAttachmentId( $uid ), $size );
		}

		if ( ! $imgUrl && $size != 'full' ) {
			$imgUrl = $this->getImgUrlByWpSize( $uid, 'full' );
		}

        $imgUrl = $this->replaceCdnUrl( $imgUrl );

        $imgUrl = apply_filters( 'brizy_after_cropped_img_url', $imgUrl );

        return $imgUrl;
    }

    /**
     * Replaces the CDN domain in the image URL with the server's domain.
     *
     * @param  string  $imgUrl  The original image URL.
     * @return string The updated image URL with the server domain and without query parameters.
     */
    private function replaceCdnUrl($imgUrl) {
        $server_domain = site_url();

        $parsed_url = parse_url($imgUrl);
        $img_domain = $parsed_url['scheme'].'://'.$parsed_url['host'];

        $path = isset($parsed_url['path']) ? $parsed_url['path'] : '';

        if ($img_domain !== $server_domain) {
            $imgUrl = str_replace($img_domain, $server_domain, $img_domain.$path);
        } else {
            $imgUrl = $img_domain.$path;
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
		return implode( '/', $parts );
	}
}
