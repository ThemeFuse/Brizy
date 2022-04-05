<?php defined( 'ABSPATH' ) or die();
/**
 * WordPress Importer class for managing parsing of WXR files.
 */
class Brizy_Import_Parser {

	private $file;

	public function __construct( $file ) {
		$this->file = $file;
	}

	/**
	 * @throws Exception
	 */
	function parse() {
		// Attempt to use proper XML parsers first
		if ( extension_loaded( 'simplexml' ) ) {
			$parser = new Brizy_Import_Parsers_Simplexml();
			$result = $parser->parse( $this->file );

			// If SimpleXML succeeds or this is an invalid WXR file then return the results
			if ( ! is_wp_error( $result ) || 'SimpleXML_parse_error' != $result->get_error_code() ) {
				return $result;
			}

		} else if ( extension_loaded( 'xml' ) ) {
			$parser = new Brizy_Import_Parsers_Xml;
			$result = $parser->parse( $this->file );

			// If XMLParser succeeds or this is an invalid WXR file then return the results
			if ( ! is_wp_error( $result ) ) {
				return $result;
			}
		}

		$errors = [];

		// We have a malformed XML file, so display the error and fallthrough to regex
		if ( isset( $result ) ) {

			if ( 'SimpleXML_parse_error' == $result->get_error_code() ) {
				foreach ( $result->get_error_data() as $error ) {
					$errors[] = $error->line . ':' . $error->column . ' ' . esc_html( $error->message );
				}
			} else if ( 'XML_parse_error' == $result->get_error_code() ) {
				$error          = $result->get_error_data();
				$errors[] = $error[0] . ':' . $error[1] . ' ' . esc_html( $error[2] );
			}

			$errors[] = __( 'Details are shown above. The importer will now try again with a different parser...', 'brizy' );
		}

		// use regular expressions if nothing else available or this is bad XML
		$parser = new Brizy_Import_Parsers_Regex;
		$data   = $parser->parse( $this->file );

		if ( is_wp_error( $data ) ) {
			throw new Exception( $data->get_error_message() );
		}

		return $data;
	}
}
