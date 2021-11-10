<?php

class Brizy_SystemChecks {

	/**
	 * @var
	 */
	private $required = [
		'php'       => '5.6',
		'extension' => [
			'xml'      => 'https://www.php.net/manual/en/book.xml.php',
			'gd'       => 'https://www.php.net/manual/en/book.image.php',
			'fileinfo' => 'https://www.php.net/manual/en/book.fileinfo.php',
			'zip'      => 'https://www.php.net/manual/en/book.zip.php',
			'curl'     => 'https://www.php.net/manual/en/book.curl.php',
			'json'     => 'https://www.php.net/manual/en/book.json.php'
		]
	];

	static public function run() {
		return new self();
	}

	private function __construct() {
		$this->checkPhpVersion();
		add_action( 'admin_notices', array( $this, 'checkPlatformReqs' ) );
	}

	public function checkPlatformReqs() {
		$this->checkExtensions( $this->required['extension'] );
	}


	private function checkPhpVersion() {
		if ( version_compare( PHP_VERSION, '5.6.0' ) < 0 ) {
			$this->notification( sprintf(
				__( '%1$s requires PHP version 5.6+, you currently running PHP %2$s. <b>%3$s IS NOT RUNNING.</b>', 'brizy' ),
				__bt( 'brizy', 'Brizy' ),
				PHP_VERSION,
				strtoupper( __bt( 'brizy', 'Brizy' ) )
			) );

			throw new Exception('Invalid PHP version');
		}
	}


	private function checkExtensions( $extensions ) {
		$notFoundExtensions = [];
		foreach ( $extensions as $key => $url ) {
			if ( ! extension_loaded( $key ) ) {
				$notFoundExtensions[ $key ] = $url;
			}
		}

		if ( count( $notFoundExtensions ) ) {
			$this->notFoundExtensionsNotification( $notFoundExtensions );
		}

	}


	private function notFoundExtensionsNotification( $extensions ) {

		$message = "The following extensions are required for " . __bt( 'brizy', 'Brizy' ) . " plugins properly work: <br>";

		foreach ( $extensions as $key => $url ) {
			$message .= '<a href="' . $url . '">extension-' . $key . '</a><br>';
		}

		$message .= '<br>';
		$message .= 'Please contact your hosting company  for support.';

		$this->notification( $message );

	}


	private function notification( $text, $type = 'error' ) {
		?>
        <div class="notice notice-<?php echo $type ?> is-dismissible">
            <p>
				<?php echo $text; ?>
            </p>
        </div>
		<?php
	}
}
