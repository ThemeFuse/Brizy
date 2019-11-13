<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var string $message
 * @var string $type
 */

?>
<div class="wrap">
    <div class="<?php echo $type; ?> settings-<?php echo $type; ?> notice-<?php echo $type; ?> notice is-dismissible">
        <p><strong><?php echo $message; ?></strong></p>
        <button type="button" class="notice-dismiss"><span class="screen-reader-text"><?php echo __('Dismiss this notice','brizy')?>.</span>
        </button>
    </div>
</div>