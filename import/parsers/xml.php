<?php defined( 'ABSPATH' ) or die();
/**
 * WordPress eXtended RSS file parser implementations
 */

/**
 * WXR Parser that makes use of the XML Parser PHP extension.
 */
class Brizy_Import_Parsers_Xml {
	var $wp_tags = array(
		'wp:post_id', 'wp:post_date', 'wp:post_date_gmt', 'wp:comment_status', 'wp:ping_status', 'wp:attachment_url',
		'wp:status', 'wp:post_name', 'wp:post_parent', 'wp:menu_order', 'wp:post_type', 'wp:post_password',
		'wp:is_sticky', 'wp:term_id', 'wp:category_nicename', 'wp:category_parent', 'wp:cat_name', 'wp:category_description',
		'wp:tag_slug', 'wp:tag_name', 'wp:tag_description', 'wp:term_taxonomy', 'wp:term_parent',
		'wp:term_name', 'wp:term_description', 'wp:author_id', 'wp:author_login', 'wp:author_email', 'wp:author_display_name',
		'wp:author_first_name', 'wp:author_last_name'
	);
	var $wp_sub_tags = array(
		'wp:comment_id', 'wp:comment_author', 'wp:comment_author_email', 'wp:comment_author_url',
		'wp:comment_author_IP',	'wp:comment_date', 'wp:comment_date_gmt', 'wp:comment_content',
		'wp:comment_approved', 'wp:comment_type', 'wp:comment_parent', 'wp:comment_user_id'
	);

	function parse( $file ) {
		$this->wxr_version      = false;
		$this->in_post          = false;
		$this->cdata            = false;
		$this->data             = false;
		$this->sub_data         = false;
		$this->in_tag           = false;
		$this->in_sub_tag       = false;
		$this->inImportSettings = false;
		$this->inPlugins        = false;

		$this->authors        = [];
		$this->posts          = [];
		$this->term           = [];
		$this->category       = [];
		$this->tag            = [];
		$this->importSettings = [];

		$xml = xml_parser_create( 'UTF-8' );
		xml_parser_set_option( $xml, XML_OPTION_SKIP_WHITE, 1 );
		xml_parser_set_option( $xml, XML_OPTION_CASE_FOLDING, 0 );
		xml_set_object( $xml, $this );
		xml_set_character_data_handler( $xml, 'cdata' );
		xml_set_element_handler( $xml, 'tag_open', 'tag_close' );

		if ( ! xml_parse( $xml, file_get_contents( $file ), true ) ) {
			$current_line   = xml_get_current_line_number( $xml );
			$current_column = xml_get_current_column_number( $xml );
			$error_code     = xml_get_error_code( $xml );
			$error_string   = xml_error_string( $error_code );

			return new WP_Error(
				'XML_parse_error',
				sprintf(
					'There was an error when reading this WXR file. Line %d, column %d, error: %s',
					$current_line,
					$current_column,
					$error_string
				)
			);
		}

		xml_parser_free( $xml );

		if ( ! preg_match( '/^\d+\.\d+$/', $this->wxr_version ) ) {
			return new WP_Error( 'WXR_parse_error', __( 'This does not appear to be a WXR file, missing/invalid WXR version number', 'brizy' ) );
		}

		return [
			'authors'        => $this->authors,
			'posts'          => $this->posts,
			'categories'     => $this->category,
			'tags'           => $this->tag,
			'terms'          => $this->term,
			'base_url'       => $this->base_url,
			'base_blog_url'  => $this->base_blog_url,
			'version'        => $this->wxr_version,
			'importSettings' => $this->importSettings,
		];
	}

	function tag_open( $parse, $tag, $attr ) {
		if ( in_array( $tag, $this->wp_tags ) ) {
			$this->in_tag = substr( $tag, 3 );
			return;
		}

		if ( in_array( $tag, $this->wp_sub_tags ) ) {
			$this->in_sub_tag = substr( $tag, 3 );
			return;
		}

		switch ( $tag ) {
			case 'category':
				if ( isset($attr['domain'], $attr['nicename']) ) {
					$this->sub_data['domain'] = $attr['domain'];
					$this->sub_data['slug'] = $attr['nicename'];
				}
				break;
			case 'item': $this->in_post = true;
			case 'title': if ( $this->in_post ) $this->in_tag = 'post_title'; break;
			case 'guid': $this->in_tag = 'guid'; break;
			case 'dc:creator': $this->in_tag = 'post_author'; break;
			case 'content:encoded': $this->in_tag = 'post_content'; break;
			case 'excerpt:encoded': $this->in_tag = 'post_excerpt'; break;

			case 'wp:term_slug': $this->in_tag = 'slug'; break;
			case 'wp:meta_key': $this->in_sub_tag = 'key'; break;
			case 'wp:meta_value': $this->in_sub_tag = 'value'; break;

			case 'importSettings':
				$this->inImportSettings = true;
				break;
			case 'plugins':
				$this->inPlugins = true;
				break;
			default:
				if ( $this->inImportSettings ) {
					$this->in_tag = $tag;
				}

				break;

		}
	}

	function cdata( $parser, $cdata ) {
		if ( ! trim( $cdata ) )
			return;

		if ( false !== $this->in_tag || false !== $this->in_sub_tag ) {
			$this->cdata .= $cdata;
		} else {
			$this->cdata .= trim( $cdata );
		}
	}

	function tag_close( $parser, $tag ) {
		switch ( $tag ) {
			case 'wp:comment':
				unset( $this->sub_data['key'], $this->sub_data['value'] ); // remove meta sub_data
				if ( ! empty( $this->sub_data ) )
					$this->data['comments'][] = $this->sub_data;
				$this->sub_data = false;
				break;
			case 'wp:commentmeta':
				$this->sub_data['commentmeta'][] = array(
					'key' => $this->sub_data['key'],
					'value' => $this->sub_data['value']
				);
				break;
			case 'category':
				if ( ! empty( $this->sub_data ) ) {
					$this->sub_data['name'] = $this->cdata;
					$this->data['terms'][] = $this->sub_data;
				}
				$this->sub_data = false;
				break;
			case 'wp:postmeta':
				if ( ! empty( $this->sub_data ) )
					$this->data['postmeta'][] = $this->sub_data;
				$this->sub_data = false;
				break;
			case 'item':
				$this->posts[] = $this->data;
				$this->data = false;
				break;
			case 'wp:category':
			case 'wp:tag':
			case 'wp:term':
				$n = substr( $tag, 3 );
				array_push( $this->$n, $this->data );
				$this->data = false;
				break;
			case 'wp:termmeta':
				if ( ! empty( $this->sub_data ) ) {
					$this->data['termmeta'][] = $this->sub_data;
				}
				$this->sub_data = false;
				break;
			case 'wp:author':
				if ( ! empty($this->data['author_login']) )
					$this->authors[$this->data['author_login']] = $this->data;
				$this->data = false;
				break;
			case 'wp:base_site_url':
				$this->base_url = $this->cdata;
				if ( ! isset( $this->base_blog_url ) ) {
					$this->base_blog_url = $this->cdata;
				}
				break;
			case 'wp:base_blog_url':
				$this->base_blog_url = $this->cdata;
				break;
			case 'wp:wxr_version':
				$this->wxr_version = $this->cdata;
				break;
			case 'importSettings':
				$this->importSettings    = $this->data;
				$this->data              = false;
				$this-> inImportSettings = false;
				break;
			case 'plugins':
				$this->data['plugins'][] = $this->sub_data;
				$this->sub_data          = false;
				$this->inPlugins         = false;
				break;
			default:

				$value = ! empty( $this->cdata ) ? $this->cdata : '';

				if ( $this->inPlugins ) {
					$this->sub_data[$this->in_tag] = $value;
					$this->in_tag = false;
				}else if ( $this->in_sub_tag ) {
					$this->sub_data[$this->in_sub_tag] = $value;
					$this->in_sub_tag = false;
				} else if ( $this->in_tag ) {
					$this->data[$this->in_tag] = $value;
					$this->in_tag = false;
				}
		}

		$this->cdata = false;
	}
}