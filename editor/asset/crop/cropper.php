<?php

class Brizy_Editor_Asset_Crop_Cropper {

	const BASIC_CROP_TYPE = 1;
	const ADVANCED_CROP_TYPE = 2;

	/**
	 * @var string[]
	 */
	private $services;

	/**
	 * Brizy_Editor_Asset_Crop_Cropper constructor.
	 */
	public function __construct() {

		$this->services = array(
			//'Brizy_Editor_Asset_Crop_ExternalService',
			'Brizy_Editor_Asset_Crop_WordpressService'
		);
	}

	/**
	 * @param $source
	 * @param $target
	 * @param $callback
	 *
	 * @return bool
	 */
	private function serviceLoop( $source, $target, $callback ) {
		foreach ( $this->services as $serviceClass ) {
			try {
				/**
				 * @var Brizy_Editor_Asset_Crop_ServiceInterface $service ;
				 */
				$service = new $serviceClass( $source, $target );

				if ( $callback( $service ) ) {
					return true;
				}
			} catch ( Exception $e ) {
				continue;
			}
		}

		return false;
	}

	/**
	 * @param $source
	 * @param $target
	 * @param $offsetX
	 * @param $offsetY
	 * @param $width
	 * @param $height
	 *
	 * @return bool
	 */
	private function serviceCrop( $source, $target, $offsetX, $offsetY, $width, $height ) {

		return $this->serviceLoop( $source, $target, function ( Brizy_Editor_Asset_Crop_ServiceInterface $service ) use ( $offsetX, $offsetY, $width, $height ) {
			$result = $service->crop( $offsetX, $offsetY, $width, $height );

			if ( $result ) {
				$result = $service->saveTargetImage();
			}

			return $result;
		} );
	}

	/**
	 * @param $source
	 * @param $target
	 * @param $width
	 * @param $height
	 *
	 * @return bool
	 */
	private function serviceResize( $source, $target, $width, $height ) {
		return $this->serviceLoop( $source, $target, function ( Brizy_Editor_Asset_Crop_ServiceInterface $service ) use ( $width, $height ) {
			$result = $service->resize( $width, $height );

			if ( $result ) {
				$result = $service->saveTargetImage();
			}

			return $result;
		} );
	}

	/**
	 * @param $source
	 * @param $target
	 * @param $filterOptions
	 *
	 * @return bool
	 */
	private function internalCrop( $source, $target, $filterOptions ) {
		if ( $filterOptions['format'] == "gif" ) {
			// do not resize
			return false;
		} else {
			list( $imgWidth, $imgHeight ) = $filterOptions['originalSize'];
			if ( $filterOptions['is_advanced'] === false ) {
				list( $requestedImgWidth, $requestedImgHeight ) = array_values( $filterOptions['requestedData'] );
				if ( $requestedImgWidth > $imgWidth && ( $requestedImgHeight == "any" || $requestedImgHeight == "*" ) ) {
					return false;
				}

				return $this->serviceResize( $source, $target, $requestedImgWidth, $requestedImgHeight );
			}

			list( $requestedImgWidth, $requestedImgHeight, $requestedOffsetX, $requestedOffsetY, $containerWidth, $containerHeight ) = array_values( $filterOptions['requestedData'] );

			if ( ( $containerWidth > $imgWidth || $containerHeight > $imgHeight ) || $requestedImgWidth > $imgWidth && $requestedImgHeight > $imgHeight ) {

				$newOffsetX = $imgWidth * $requestedOffsetX / $requestedImgWidth;
				$newOffsetY = $imgHeight * $requestedOffsetY / $requestedImgHeight;

				$newImgWidth  = $imgWidth * $containerWidth / $requestedImgWidth;
				$newImgHeight = $imgHeight * $containerHeight / $requestedImgHeight;

				return $this->serviceCrop( $source, $target, $newOffsetX, $newOffsetY, $newImgWidth, $newImgHeight );

			} else {

				return $this->serviceLoop( $source, $target, function ( Brizy_Editor_Asset_Crop_ServiceInterface $service ) use ( $source, $target, $requestedImgWidth, $requestedImgHeight, $requestedOffsetX, $requestedOffsetY, $containerWidth, $containerHeight ) {
					$result = $service->resize( $requestedImgWidth, $requestedImgHeight );
					if ( $result && $service->crop( $requestedOffsetX, $requestedOffsetY, $containerWidth, $containerHeight ) ) {
						$result = $service->saveTargetImage();

						if ( ! $result ) {
							@unlink( $target );
						}

						return $result;
					}

					return false;
				} );
			}
		}
	}

	/**
	 * @param $source
	 * @param $target
	 * @param $filter
	 *
	 * @return bool
	 * @throws Exception
	 */
	public function crop( $source, $target, $filter, $originalSizes ) {

		try {
			wp_raise_memory_limit( 'image' );

			return $this->internalCrop( $source, $target, $this->getFilterOptions( $source, $filter, $originalSizes ) );
		} catch ( Exception $e ) {
			Brizy_Logger::instance()->error( $e->getMessage(), [ $e ] );

			return false;
		}
	}

	/**
	 * @param $source
	 * @param $filter
	 *
	 * @return array
	 * @throws Exception
	 */
	public function getFilterOptions( $source, $filter, $originalSizes ) {

		parse_str( strtolower( $filter ), $output );
		$configuration                 = array();
		$configuration['format']       = pathinfo( basename( $source ), PATHINFO_EXTENSION );
		$configuration['originalSize'] = $originalSizes;

		$cropType = $this->getCropType( $filter );

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
	 * @param $filter
	 *
	 * @return int|null
	 * @throws Exception
	 */
	private function getCropType( $filter ) {
		$regExAdvanced = "/^iW=[0-9]{1,4}&iH=[0-9]{1,4}&oX=[0-9]{1,4}&oY=[0-9]{1,4}&cW=[0-9]{1,4}&cH=[0-9]{1,4}$/is";
		$regExBasic    = "/^iW=[0-9]{1,4}&iH=([0-9]{1,4}|any|\*{1})$/is";

		if ( preg_match( $regExBasic, $filter ) ) {
			$cropType = self::BASIC_CROP_TYPE;
		} elseif ( preg_match( $regExAdvanced, $filter ) ) {
			$cropType = self::ADVANCED_CROP_TYPE;
		} else {
			throw new Exception( "Invalid size format." );
		}

		return $cropType;
	}
}