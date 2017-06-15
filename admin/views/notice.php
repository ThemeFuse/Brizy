<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var string $message
 * @var string $type
 */

?>
<div class="notice notice-<?php echo $type; ?> is-dismissible">
    <p><?php echo $message; ?></p>
</div>
