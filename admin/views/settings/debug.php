<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var array $types
 */
?>
<div class="wrap">
    <h1>Debug Information</h1>

    <fieldset style="border: 1px solid red; padding: 15px;">
        <pre>
        <?php
        $data = get_option( 'brizy' );
        print_r($data);
        ?>
        </pre>
    </fieldset>
</div>