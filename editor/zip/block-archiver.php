<?php

class Brizy_Editor_Zip_BlockArchiver implements Brizy_Editor_Zip_ArchiverInterface {
	use Brizy_Editor_Asset_AttachmentAware;

	/**
	 * @var Brizy_Editor_Project
	 */
	protected $project;
	/**
	 * @var Brizy_Admin_Fonts_Manager
	 */
	protected $fontManager;

	/**
	 * @var string
	 */
	protected $editorVersion;

	public function __construct( Brizy_Editor_Project $project, Brizy_Admin_Fonts_Manager $fontManager, $editorVersion ) {
		$this->project       = $project;
		$this->fontManager   = $fontManager;
		$this->editorVersion = $editorVersion;

		if ( ! class_exists( 'ZipArchive' ) ) {
			throw new InvalidArgumentException( 'You system does now support zip extension installed' );
		}
	}

	/**
	 * @param Brizy_Editor_Block $block
	 * @param null $outZipPath
	 *
	 * @return mixed|string|null
	 * @throws Exception
	 */
	public function createZip( $blocks, $outZipPath = null ) {

		// create archive folder
		if ( ! $outZipPath ) {
			$outZipPath = $this->prepareArchiveFilepath( "Blocks-" . date( DATE_ATOM )  );
		}

		$z = new ZipArchive();
		$z->open( $outZipPath, ZipArchive::CREATE );

		foreach ( $blocks as $block ) {
			$this->addBlockToZip( $z, $block );
		}

		if ( ! $z->close() ) {
			throw new Exception( 'Failed to create archive.' );
		}
		unset( $z );

		return $outZipPath;
	}

	public function addBlockToZip( ZipArchive $z, Brizy_Editor_Post $block ) {
		// get block data
		$data = array(
			'class'         => get_class( $block ),
			'meta'          => $block->getMeta(),
			'media'         => $block->getMedia(),
			'data'          => $block->get_editor_data(),
			'editorVersion' => $block->get_editor_version(),
			'files'         => [
				'images'      => [],
				'uploads'     => [],
				'screenshots' => [],
				'fonts'       => [],
			]
		);

		$z->addEmptyDir( $block->getUid() );

		$media   = json_decode( $block->getMedia() );
		$meta    = json_decode( $block->getMeta() );
		$manager = new Brizy_Editor_Screenshot_Manager( new  Brizy_Editor_UrlBuilder( $this->project, $block ) );

		// create block data json file
		$data = $this->addImages( $z, $media, $data, $block->getUid() );
		$data = $this->addUploads( $z, $media, $data, $block->getUid() );
		$data = $this->addFonts( $z, $media, $data, $block->getUid() );
		$data = $this->addScreenshot( $z, $meta, $manager, $data, $block->getUid() );

		$z->addFromString( $block->getUid() . "/data.json", json_encode( $data ) );
	}

	public function createFromZip( $zipPath ) {

		global $wpdb;
		if ( ! file_exists( $zipPath ) ) {
			throw new Exception( "Unable to find the archive path." );
		}
		$z = new ZipArchive();
		$z->open( $zipPath );
		$instances = [];
		// As long as statIndex() does not return false keep iterating

		try {
			$wpdb->query( "START TRANSACTION" );
			for ( $idx = 0; $zipFile = $z->statIndex( $idx ); $idx ++ ) {
				if ( \is_dir( $zipFile['name'] ) ) {
					$instances[] = $this->createSingleFromZipPath( $z, $zipFile['name'] );
				}
			}

			$wpdb->query( "COMMIT" );
		} catch ( Exception $e ) {
			$wpdb->query( "ROLLBACK" );
			throw new Exception( 'Failed to create object from archive.' );
		}

		$z->close();

		return $instances;
	}

	private function createSingleFromZipPath( ZipArchive $z, $dir ) {

		$data        = json_decode( $z->getFromName( $dir . '/data.json' ) );
		$entityClass = $data->class;

		if ( ! class_exists( $entityClass ) && $entityClass !== Brizy_Editor_Block::class ) {
			throw new Exception( "Unable to find the archived object class." );
		}

		if ( ! $this->supportBlockVersion( $data->editorVersion ) ) {
			throw new Exception( "Unsupported object version" );
		}

		/**
		 * @var Brizy_Editor_Block $block ;
		 */
		$block = $this->getBlockManager()->createEntity( md5( random_bytes( 10 ) ), 'publish' );
		$block->set_needs_compile( true );
		$block->set_editor_data( $data->data );
		$block->setMeta( $data->meta );
		$block->setMedia( $data->media );
		$block->set_editor_version( $data->editorVersion );
		$block->setDataVersion( 1 );
		$block->save();

		// store images
		$this->allowUploadsInCallback( function () use ( $data, $z, $block ) {
			$this->storeImages( $data, $z, $block );
			$this->storeUploads( $data, $z, $block );
		} );

		$this->storeFonts( $data, $z, $block );

		return $block;
	}

	public function getEditorVersion() {
		return $this->editorVersion;
	}

	public function supportBlockVersion( $version ) {
		return version_compare( $this->getEditorVersion(), $version, '>=' );
	}

	protected function prepareArchiveFilepath( $folderName ) {
		return sys_get_temp_dir() . DIRECTORY_SEPARATOR . $folderName . ".zip";
	}

	protected function storeImages( $data, ZipArchive $z, Brizy_Editor_Block $block) {

		$urlBuilder = new Brizy_Editor_UrlBuilder( $this->project, $block->getWpPostId() );
		foreach ( $data->files->images as $uid => $path ) {

			if ( $this->getAttachmentByMediaName( $uid ) ) {
				continue;
			}

			$basename                     = basename( $path );
			$original_asset_path          = $urlBuilder->page_upload_path( "/assets/images/" . $basename );
			$original_asset_path_relative = $urlBuilder->page_upload_relative_path( "/assets/images/" . $basename );
			wp_mkdir_p( dirname( $original_asset_path ) );
			file_put_contents( $original_asset_path, $z->getFromName( $path ) );

			Brizy_Editor_Asset_StaticFileTrait::createMediaAttachment( $original_asset_path, $original_asset_path_relative, $block->getWpPostId(), $uid );
		}

	}

	protected function storeFonts( $data, ZipArchive $z, Brizy_Editor_Block $block ) {
		foreach ( $data->files->fonts as $fontUid => $font ) {
			$family  = $font->family;
			$weights = $font->weights;

			$newWeights = array();

			foreach ( (array) $weights as $weight => $weightType ) {
				foreach ( (array) $weightType as $type => $filePath ) {
					$newWeights[ $weight ][ $type ] = $this->downloadFileToTemporaryFile( basename( $filePath ), $z->getFromName( $filePath ) );
				}
			}

			try {
				$this->fontManager->createFont( $fontUid, $family, $newWeights, 'uploaded' );
			} catch ( Brizy_Admin_Fonts_Exception_DuplicateFont $e ) {
				continue;
			} catch ( Exception $e ) {
				throw new Exception( 'Failed to create font [' . $fontUid . '] from archive.' );
			}
		}
	}

	protected function storeUploads( $data, ZipArchive $z, Brizy_Editor_Block $block ) {

		$urlBuilder = new Brizy_Editor_UrlBuilder( $this->project, $block->getWpPostId() );
		foreach ( $data->files->uploads as $uidKey => $path ) {
			list( $uid, $uploadName ) = explode( '|||', $uidKey );
			if ( $this->getAttachmentByMediaName( $uid ) ) {
				continue;
			}

			$original_asset_path          = $urlBuilder->brizy_upload_path( "/custom_files/" . $uploadName );
			$original_asset_path_relative = $urlBuilder->brizy_upload_relative_path( "/custom_files/" . $uploadName );
			wp_mkdir_p( dirname( $original_asset_path ) );
			file_put_contents( $original_asset_path, $z->getFromName( $path ) );

			Brizy_Editor_Asset_StaticFileTrait::createMediaAttachment( $original_asset_path, $original_asset_path_relative, $block->getWpPostId(), $uid );
		}
	}

	protected function downloadFileToTemporaryFile( $basename, $content ) {
		$filePath = tempnam( sys_get_temp_dir(), $basename );
		$result   = file_put_contents( $filePath, $content );

		if ( $result === false ) {
			throw new Exception( 'Filed to write font content' );
		}

		return array(
			'name'     => $basename,
			'type'     => mime_content_type( $filePath ),
			'tmp_name' => $filePath,
			'error'    => 0,
			'size'     => filesize( $filePath )
		);
	}

	protected function getBlockManager() {
		return new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_SAVED );
	}

	/**
	 * @param ZipArchive $z
	 * @param $block
	 * @param $filesImagesPath
	 * @param array $data
	 *
	 * @return array
	 * @throws Exception
	 */
	protected function addImages( ZipArchive $z, $media, array $data, $dir ) {
		$z->addEmptyDir( $filesImagesPath = $dir.'/files/images' );

		foreach ( $media->images as $mediaUid ) {
			$mediaId = (int) $this->getAttachmentByMediaName( $mediaUid );
			if ( ! $mediaId ) {
				//throw new Exception("Unable to find media {$mediaUid}");
				continue;
			}
			$imagePath = get_attached_file( $mediaId );
			$imageName = basename( $imagePath );
			if ( file_exists( $imagePath ) ) {
				$path =  $filesImagesPath . "/" . $imageName;
				$z->addFile( $imagePath, $path );
				$data['files']['images'][ $mediaUid ] = $path;
			} else {
				throw new Exception( 'Archive object failed. The file ' . $imagePath . ' does not exist' );
			}
		}

		return $data;
	}

	/**
	 * @param ZipArchive $z
	 * @param $media
	 * @param array $data
	 *
	 * @return array
	 */
	protected function addUploads( ZipArchive $z, $media, array $data, $dir ) {

		$z->addEmptyDir( $filesUploadsPath = $dir.'/files/uploads' );
		foreach ( $media->uploads as $mediaUpload ) {
			list( $uploadUid, $uploadName ) = explode( '|||', $mediaUpload );
			$mediaId  = (int) $this->getAttachmentByMediaName( $uploadUid );
			$filePath = get_attached_file( $mediaId );
			$fileName = basename( $filePath );
			if ( file_exists( $filePath ) ) {
				$path = $filesUploadsPath . "/" . $fileName;
				$z->addFile( $filePath, $path );
				$data['files']['uploads'][ $mediaUpload ] = $path;
			}
		}

		return $data;
	}

	/**
	 * @param $media
	 * @param ZipArchive $z
	 * @param $filesFontsPath
	 * @param array $data
	 *
	 * @return array
	 * @throws Exception
	 */
	protected function addFonts( ZipArchive $z, $media, array $data, $dir ) {
		$z->addEmptyDir( $filesFontsPath = $dir.'/files/fonts' );
		foreach ( $media->fonts as $fontUid ) {
			$fontData = $this->fontManager->getFontForExport( $fontUid );
			if ( ! $fontData ) {
				//throw new \Exception("Unable to find font {$fontUid}");
				continue;
			}

			// prepare fontData data
			foreach ( $fontData['weights'] as $weigth => $files ) {
				foreach ( $files as $type => $file ) {
					$fontName = basename( $file );

					if ( file_exists( $file ) ) {
						$path =  $filesFontsPath . "/" . $fontName;
						$z->addFile( $file, $path );
						$fontData['weights'][ $weigth ][ $type ] = $path;
						$data['files']['fonts'][ $fontUid ]      = $fontData;
					} else {
						throw new Exception( 'Archive object failed. The file ' . $file . ' does not exist' );
					}
				}
			}
		}

		return $data;
	}

	/**
	 * @param ZipArchive $z
	 * @param $meta
	 * @param $block
	 * @param array $data
	 *
	 * @return array
	 * @throws Exception
	 */
	protected function addScreenshot( ZipArchive $z, $meta, $manager, array $data, $dir ) {
		$screenUid = $meta->_thumbnailSrc;
		if ( $screenUid ) {

			$screenPath = $manager->getScreenshot( $screenUid );
			if ( ! file_exists( $screenPath ) ) {
				throw new Exception( 'Archive object failed. The file ' . $screenPath . ' does not exist' );
			}
			$zipScreenPath = $dir . "/files/screenshots/" . basename( $screenPath );
			$z->addFile( $screenPath, $zipScreenPath );
			$data['files']['screenshots'][ $screenUid ] = $zipScreenPath;
		}

		return $data;
	}

	protected function allowUploadsInCallback( $callback ) {
		// enable svg upload
		$svnUpload         = new Brizy_Admin_Svg_Main();
		$jsonUpload        = new Brizy_Admin_Json_Main();
		$svnUploadEnabled  = Brizy_Editor_Storage_Common::instance()->get( 'svg-upload', false );
		$jsonUploadEnabled = Brizy_Editor_Storage_Common::instance()->get( 'json-upload', false );

		if ( ! $svnUploadEnabled ) {
			$svnUpload->enableSvgUpload();
		}
		if ( ! $jsonUploadEnabled ) {
			$jsonUpload->enableJsonUpload();
		}

		$callback();

		// disabled it if was disabled before
		if ( ! $svnUploadEnabled ) {
			$svnUpload->disableSvgUpload();
		}
		if ( ! $jsonUploadEnabled ) {
			$jsonUpload->disableJsonUpload();
		}
	}

}
