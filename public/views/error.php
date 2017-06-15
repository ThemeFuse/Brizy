<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var string $message
 */

$back = '<a href="#" onclick="window.history.back()">'
        . __( 'Go back', bitblox_wp()->get_domain() )
        . '</a>';
_default_wp_die_handler( $message . '<br>' . $back );
