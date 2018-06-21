<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * @var array $types
 */
?>
<div class="wrap">
    <h1><?php echo brizy()->get_name() ?></h1>
    <form method="post" novalidate="novalidate">
		<?php wp_nonce_field() ?>
        <table class="form-table">
            <tbody>
            <tr>
                <th scope="row"><?php echo __( 'Post Types' ); ?></th>
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
                <th scope="row"><?php echo __( 'Exclude for roles' ); ?></th>
                <td>
                    <fieldset>
						<?php
						foreach ( $roles as $role ) {
							do_action( 'brizy_settings_exclude_role_row', $role );
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
                    id="submit"
                    class="button button-primary"
            ><?php _e( 'Save Changes' ); ?></button>
        </p>
    </form>
</div>