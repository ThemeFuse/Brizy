<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var string $message
 */

$back = '<a href="#" onclick="window.history.back()">'
        . __( 'Go back', brizy()->get_domain() )
        . '</a>';
?>

<h3><?php echo $message; ?></h3>
<p><?php echo $back; ?></p>
