<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 4/19/18
 * Time: 3:48 PM
 */

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
	private $post;

	/**
	 * Brizy_Editor_CropCacheMedia constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 * @param Brizy_Editor_Post $post
	 */
	public function __construct( $project, $post ) {

		$this->post        = $post;
		$this->url_builder = new Brizy_Editor_UrlBuilder( $project, $post );
	}

	/**
	 * @param $madia_name
	 *
	 * @return string
	 * @throws Exception
	 */
	public function download_original_image( $madia_name ) {

		// Check if user is querying API
		if ( ! $madia_name  ) {
			Brizy_Logger::instance()->error( 'Empty media file provided' );
			throw new InvalidArgumentException( "Invalid media file" );
		}
		if ( strpos( $madia_name, "wp-" ) === 0  ) {
			Brizy_Logger::instance()->error( 'Invalid try to download wordpress file from application server' );
			throw new InvalidArgumentException( "Invalid media file" );
		}

		$external_asset_url  = $this->url_builder->external_media_url( "iW=5000&iH=any/" . $madia_name );
		$original_asset_path = $this->url_builder->upload_path( $this->url_builder->page_asset_path( "images/" . $madia_name ) );

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

			// attach to post
			$parent_post_id = $this->post->get_parent_id();
			$attach_to_post = $this->attach_to_post( $original_asset_path, $parent_post_id, $madia_name );
			if ( $attach_to_post === 0 || is_wp_error( $attach_to_post ) ) {
				Brizy_Logger::instance()->error( 'Unable to attach media file', array(
					'media'       => $original_asset_path,
					'parent_post' => $parent_post_id
				) );
				throw new Exception( 'Unable to attach media' );
			}
		}

		return $original_asset_path;
	}

	/**
	 * @param $original_asset_path
	 * @param $media_filter
	 *
	 * @return string
	 * @throws Exception
	 */
	public function crop_media( $original_asset_path, $media_filter ) {

		// Check if user is querying API
		if ( ! file_exists( $original_asset_path ) ) {
			throw new InvalidArgumentException( "Invalid media file" );
		}

		if ( ! $media_filter ) {
			throw new InvalidArgumentException( "Invalid crop filter" );
		}

		$resized_page_asset_path = $this->url_builder->upload_path( $this->url_builder->page_asset_path( "images/" . $media_filter ) );
		$ext                     = pathinfo( $original_asset_path, PATHINFO_EXTENSION );
		$resized_image_path      = $resized_page_asset_path . "/" . md5( $original_asset_path ) . '.' . $ext;

		// resize image
		if ( $media_filter ) {

			if ( ! file_exists( $resized_image_path ) ) {

				@mkdir( $resized_page_asset_path, 0755, true );

				// Set artificially high because GD uses uncompressed images in memory.
				wp_raise_memory_limit( 'image' );

				$imagine = $this->crop( $original_asset_path, $media_filter );

				if ( $imagine ) {
					$imagine->save( $resized_image_path );
					unset( $imagine );

					return $resized_image_path;
				}
			}
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

}