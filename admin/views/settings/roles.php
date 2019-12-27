<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}
?>

<form method="post" novalidate="novalidate">
    <input type="hidden" name="tab" value="roles"/>
	<?php wp_nonce_field() ?>
    <table class="form-table">
        <tbody>
		<?php
		if ( is_array( $roles ) ) {
			foreach ( $roles as $role ) {
				do_action( 'brizy_settings_role_capability_row', $role );
			}
		}
		?>
        </tbody>
    </table>


    <p class="submit">
        <button type="submit"
                id="submit"
                class="button button-primary"
        ><?php echo __( 'Save Changes', 'brizy' ); ?></button>
    </p>
</form>
