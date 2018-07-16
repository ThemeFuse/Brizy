<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}
?>

<form method="post" novalidate="novalidate">
    <input type="hidden" name="tab" value="general"/>
	<?php wp_nonce_field() ?>
    <table class="form-table">
        <tbody>
        <tr>
            <th scope="row"><?php echo __( 'Activate Brizy For' ); ?></th>
            <td>
                <fieldset>
					<?php foreach ( $types as $type ) {
						do_action( 'brizy_settings_post_type_row', $type );
						?><br><?php
					}
					?>
                </fieldset>
            </td>
        </tr>
        </tbody>
    </table>


    <p class="submit">
        <button type="submit"
                name="brizy-general-submit"
                id="submit"
                class="button button-primary"
        ><?php _e( 'Save Changes' ); ?></button>
    </p>
</form>
