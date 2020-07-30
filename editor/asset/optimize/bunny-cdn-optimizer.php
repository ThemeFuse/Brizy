<?php

class  Brizy_Editor_Asset_Optimize_BunnyCdnOptimizer implements Brizy_Editor_Asset_Optimize_OptimizerInterface {

	const ID = 'bunny-cdn';

	private $proxy = "";

	/**
	 * Brizy_Editor_Asset_Optimize_BunnyCdnOptimizer constructor.
	 *
	 * @param $settings
	 *
	 * @throws Exception
	 */
	public function __construct( $settings ) {
		$this->proxy = Brizy_Config::CDN;
	}

	public function validateConfig() {
		return true;
	}

	/**
	 * @param $sourcePath
	 * @param $targetPath
	 *
	 * @return mixed
	 */
	public function optimize( $sourcePath, $targetPath ) {

		$params = array(
			"file" => new CURLFile( $sourcePath )
		);

		$file_upload_request = function ( $handle_or_parameters, $request = '', $url = '' ) use ( $params ) {
			$this->updateWPHTTPRequest( $handle_or_parameters, $params );
		};
		// handle cURL requests
		add_action( 'http_api_curl', $file_upload_request, 10 );
		// handle fsockopen
		add_action( 'requests-fsockopen.before_send', $file_upload_request, 10, 3 );
		$http = new WP_Http();

		$response = $http->post( $this->proxy, array(
			'headers' => [ 'Content-Type' => 'multipart/form-data' ],
			'body'    => $params,
			'timeout' => 40
		) );

		remove_action( 'http_api_curl', $file_upload_request );
		remove_action( 'requests-fsockopen.before_send', $file_upload_request );

		if ( is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) !== 200 ) {
			return false;
		}

		$body = wp_remote_retrieve_body( $response );

		$jsonFile = json_decode( $body );

		if ( $jsonFile && $jsonFile->data ) {

			$request = wp_remote_get( $jsonFile->data->url, [
				'headers' => [
					'Accept' => 'image/webp'
				]
			] );

			if (
				wp_remote_retrieve_header( $request, 'content-type' ) !== 'image/webp'
				||
				wp_remote_retrieve_response_code( $request ) !== 200
				||
				! ( $img = wp_remote_retrieve_body( $request ) )
			)  {
				return false;
			}

			$nr_of_bytes = file_put_contents( $targetPath, $img );

			if ( false === $nr_of_bytes ) {
				return false;
			}

			$http = new WP_Http();

			$response = $http->request( $this->proxy, array(
				'method'  => "DELETE",
				'headers' => [ 'Content-Type' => 'application/json' ],
				'body'    => json_encode( $jsonFile->data ),
				'timeout' => 40
			) );

			if ( wp_remote_retrieve_response_code( $response ) == 204 ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @return string
	 */
	public static function getId() {
		return self::ID;
	}

	private function updateWPHTTPRequest( &$handle_or_parameters, $form_body_arguments ) {
		if ( function_exists( 'curl_init' ) && function_exists( 'curl_exec' ) ) {
			curl_setopt( $handle_or_parameters, CURLOPT_POSTFIELDS, $form_body_arguments );
		} elseif ( function_exists( 'fsockopen' ) ) {
			$form_fields = [];
			$form_files  = [];
			foreach ( $form_body_arguments as $name => $value ) {
				if ( file_exists( $value ) ) {
					// Not great for large files since it dumps into memory but works well for small files
					$form_files[ $name ] = file_get_contents( $value );
				} else {
					$form_fields[ $name ] = $value;
				}
			}

			function build_data_files( $boundary, $fields, $files ) {
				$data = '';
				$eol  = "\r\n";

				$delimiter = '-------------' . $boundary;

				foreach ( $fields as $name => $content ) {
					$data .= "--" . $delimiter . $eol
					         . 'Content-Disposition: form-data; name="' . $name . "\"" . $eol . $eol
					         . $content . $eol;
				}

				foreach ( $files as $name => $content ) {
					$data .= "--" . $delimiter . $eol
					         . 'Content-Disposition: form-data; name="' . $name . '"; filename="' . $name . '"' . $eol
					         //. 'Content-Type: image/png'.$eol
					         . 'Content-Transfer-Encoding: binary' . $eol;

					$data .= $eol;
					$data .= $content . $eol;
				}
				$data .= "--" . $delimiter . "--" . $eol;

				return $data;
			}

			$boundary             = uniqid();
			$handle_or_parameters = build_data_files( $boundary, $form_fields, $form_files );
		}
	}
}
