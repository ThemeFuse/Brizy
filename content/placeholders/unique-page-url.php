<?php

use BrizyPlaceholders\ContentPlaceholder;

class Brizy_Content_Placeholders_UniquePageUrl extends Brizy_Content_Placeholders_Simple {


	/**
	 * Brizy_Content_Placeholders_Simple constructor.
	 *
	 * @param $label
	 * @param $placeholder
	 * @param $value
	 * @param string $display
	 */
	public function __construct( $label, $placeholder = 'brizy_dc_current_page_unique_url', $value = null, $display = Brizy_Content_Placeholders_Abstract::DISPLAY_INLINE ) {
		$this->setLabel( $label );
		$this->setPlaceholder( $placeholder );
		$this->setDisplay( $display );

		$this->value = null;
	}

	/**
	 * @param ContentPlaceholder $contentPlaceholder
	 * @param Brizy_Content_Context $context
	 *
	 * @return mixed|string
	 */
    public function getValue(\BrizyPlaceholders\ContextInterface $context, ContentPlaceholder $contentPlaceholder) {

		global $wp;

		$url = home_url( add_query_arg(array(), $wp->request) );

		$closure = function () {
			return false;
		};

		add_filter( 'pre_term_link', $closure );

		$object = get_queried_object();

		if(is_archive()) {
			$url =  add_query_arg($wp->query_vars, home_url() );
		}

		if ( $object instanceof WP_User ) {
			$file = home_url( '/' );
			$url = $file . '?author=' . $object->ID;
		}

		if ( $object instanceof WP_Post ) {
			$url = $object->guid;
		}

		if ( $object instanceof WP_Term ) {
			$url = get_term_link( $object );
		}

		remove_filter( 'pre_term_link', $closure );

		return $url;
	}


}