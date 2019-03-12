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

	public function getResizedMediaPath( $original_asset_path, $media_filter ) {
		$resized_page_asset_path = $this->url_builder->page_upload_path( "/assets/images/" . $media_filter );
		$ext                     = pathinfo( $original_asset_path, PATHINFO_EXTENSION );

		return $resized_page_asset_path . "/" . md5( $original_asset_path ) . '.' . $ext;
	}

	/**
	 * @param $original_asset_path
	 * @param $media_filter
	 * @param bool $force_crop
	 *
	 * @return string
	 * @throws Exception
	 */
	public function crop_media( $original_asset_path, $media_filter, $force_crop = true ) {

		// Check if user is querying API
		if ( ! file_exists( $original_asset_path ) ) {
			throw new InvalidArgumentException( "Invalid media file" );
		}

		if ( ! $media_filter ) {
			throw new InvalidArgumentException( "Invalid crop filter" );
		}

		$resized_page_asset_path = $this->url_builder->page_upload_path( "/assets/images/" . $media_filter );
		$resized_image_path = $this->getResizedMediaPath( $original_asset_path, $media_filter );

		// resize image
		if ( ! file_exists( $resized_image_path ) ) {

			if(!$force_crop) {
				throw new Exception('Resized media not found');
			}

			@mkdir( $resized_page_asset_path, 0755, true );

			// Set artificially high because GD uses uncompressed images in memory.
			wp_raise_memory_limit( 'image' );

			$closure = function ( $arg ) {
				return 100;
			};
			add_filter( 'jpeg_quality', $closure );

			$imagine = $this->crop( $original_asset_path, $media_filter );

			if ( $imagine ) {
				$imagine->save( $resized_image_path );
				unset( $imagine );
			}
			remove_filter( 'jpeg_quality', $closure );
		}

		return $resized_image_path;
	}

	/**
	 * @param $original_path
	 * @param $resize_params
	 *
	 * @return WP_Error|WP_Image_Editor
	 * @throws Exception
	 */
	private function crop( $original_path, $resize_params ) {
		$imageEditor = wp_get_image_editor( $original_path );

		if ( $imageEditor instanceof WP_Error ) {
			Brizy_Logger::instance()->error( $imageEditor->get_error_message(), array( $imageEditor ) );
			throw new Exception( "Unable to obtain the image editor" );
		}

		$regExAdvanced = "/^iW=[0-9]{1,4}&iH=[0-9]{1,4}&oX=[0-9]{1,4}&oY=[0-9]{1,4}&cW=[0-9]{1,4}&cH=[0-9]{1,4}$/is";
		$regExBasic    = "/^iW=[0-9]{1,4}&iH=([0-9]{1,4}|any|\*{1})$/is";

		if ( preg_match( $regExBasic, $resize_params ) ) {
			$cropType = self::BASIC_CROP_TYPE;
		} elseif ( preg_match( $regExAdvanced, $resize_params ) ) {
			$cropType = self::ADVANCED_CROP_TYPE;
		} else {
			throw new Exception( "Invalid size format." );
		}

		$filter_configuration                 = $this->getFilterOptions( $cropType, $original_path, $resize_params );
		$filter_configuration['originalSize'] = array_values( $imageEditor->get_size() );

		if ( $filter_configuration['format'] == "gif" ) {
			// do not resize
			return $imageEditor;
		} else {

			list( $imgWidth, $imgHeight ) = $filter_configuration['originalSize'];
			if ( $filter_configuration['is_advanced'] === false ) {
				list( $requestedImgWidth, $requestedImgHeight ) = array_values( $filter_configuration['requestedData'] );
				if ( $requestedImgWidth > $imgWidth && ( $requestedImgHeight == "any" || $requestedImgHeight == "*" ) ) {
					return $imageEditor;
				}
				$imageEditor->resize( $requestedImgWidth, $requestedImgHeight );

				return $imageEditor;
			}

			list( $requestedImgWidth, $requestedImgHeight, $requestedOffsetX, $requestedOffsetY, $containerWidth, $containerHeight ) = array_values( $filter_configuration['requestedData'] );

			if ( ( $containerWidth > $imgWidth || $containerHeight > $imgHeight ) || $requestedImgWidth > $imgWidth && $requestedImgHeight > $imgHeight ) {

				$newOffsetX = $imgWidth * $requestedOffsetX / $requestedImgWidth;
				$newOffsetY = $imgHeight * $requestedOffsetY / $requestedImgHeight;

				$newImgWidth  = $imgWidth * $containerWidth / $requestedImgWidth;
				$newImgHeight = $imgHeight * $containerHeight / $requestedImgHeight;

				$imageEditor->crop( $newOffsetX, $newOffsetY, $newImgWidth, $newImgHeight );

			} else {
				$imageEditor->resize( $requestedImgWidth, $requestedImgHeight );
				$imageEditor->crop( $requestedOffsetX, $requestedOffsetY, $containerWidth, $containerHeight );
			}

			return $imageEditor;
		}
	}

	/**
	 * @param $cropType
	 * @param $image_path
	 * @param $resize_params
	 *
	 * @return array
	 */
	private function getFilterOptions( $cropType, $image_path, $resize_params ) {

		parse_str( strtolower( $resize_params ), $output );
		$configuration           = array();
		$configuration['format'] = pathinfo( basename( $image_path ), PATHINFO_EXTENSION );

		switch ( $cropType ) {
			case self::BASIC_CROP_TYPE:
				$configuration['requestedData']['imageWidth']  = (int) $output['iw'];
				$configuration['requestedData']['imageHeight'] = (int) $output['ih'];
				$configuration['is_advanced']                  = false;
				break;
			case self::ADVANCED_CROP_TYPE:
				$configuration['requestedData']['imageWidth']  = (int) $output['iw'];
				$configuration['requestedData']['imageHeight'] = (int) $output['ih'];
				$configuration['requestedData']['offsetX']     = (int) $output['ox'];
				$configuration['requestedData']['offsetY']     = (int) $output['oy'];
				$configuration['requestedData']['cropWidth']   = (int) $output['cw'];
				$configuration['requestedData']['cropHeight']  = (int) $output['ch'];
				$configuration['is_advanced']                  = true;
				break;
		}

		return $configuration;
	}


	/**
	 * @param $media_name
	 *
	 * @return null|string
	 */
	private function getAttachmentByMediaName( $media_name ) {

		global $wpdb;

		$posts_table = $wpdb->posts;
		$meta_table  = $wpdb->postmeta;

		return $wpdb->get_var( $wpdb->prepare(
			"SELECT 
						{$posts_table}.ID
					FROM {$posts_table}
						INNER JOIN {$meta_table} ON ( {$posts_table}.ID = {$meta_table}.post_id )
					WHERE 
						( {$meta_table}.meta_key = 'brizy_attachment_uid' 
						AND {$meta_table}.meta_value = %s )
						AND {$posts_table}.post_type = 'attachment'
						AND {$posts_table}.post_status = 'inherit'
					GROUP BY {$posts_table}.ID
					ORDER BY {$posts_table}.post_date DESC",
			$media_name
		) );

	}
}