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
            <th scope="row">
                <?php echo sprintf( __( 'Activate %s for:', 'brizy' ), __bt( 'brizy', 'Brizy' ) ); ?>
            </th>
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
        <tr>
            <th scope="row">
                <?php _e( 'Enable SVG uploads', 'brizy' ); ?>
            </th>
            <td>
                <label>
                    <input type="checkbox"
                           id="svg-upload-enabled"
                           name="svg-upload-enabled"
                           value="1"
			            <?php echo $svgUploadEnabled ? 'checked' : ''; ?>
                    >

                </label>
            </td>
        </tr>
        <tr>
            <th scope="row">
                <?php _e( 'Enable JSON uploads', 'brizy' ); ?>
            </th>
            <td>
                <label>
                    <input type="checkbox"
                           id="json-upload-enabled"
                           name="json-upload-enabled"
                           value="1"
                        <?php echo $jsonUploadEnabled ? 'checked' : ''; ?>
                    >

                </label>
            </td>
        </tr>
        </tbody>
    </table>

    <p class="submit">
        <button type="submit" name="brizy-general-submit" id="submit" class="button button-primary">
            <?php _e( 'Save Changes', 'brizy' ); ?>
        </button>
    </p>
</form>
