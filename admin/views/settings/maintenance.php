<?php defined( 'ABSPATH' ) or die(); ?>

<form method="post" novalidate="novalidate">
	<input type="hidden" name="tab" value="maintenance"/>
	<?php wp_nonce_field() ?>
	<table class="form-table">
		<tbody>
            <tr>
                <th>
                    <label for="brizy-maintenance-mode"><?php _e( 'Choose Mode', 'brizy' ); ?></label>
                </th>
                <td>
                    <select name="brizy_maintenance_mode" id="brizy-maintenance-mode">
                        <option value=""<?php selected( $mode, '' ); ?>><?php _e( 'Disabled', 'brizy' ); ?></option>
                        <option value="coming_soon"<?php selected( $mode, 'coming_soon' ); ?>><?php _e( 'Coming Soon', 'brizy' ); ?></option>
                        <option value="maintenance"<?php selected( $mode, 'maintenance' ); ?>><?php _e( 'Maintenance', 'brizy' ); ?></option>
                    </select>
                </td>
            </tr>
            <tr>
                <th>
                    <label for="brizy-maintenance-role-access"><?php _e( 'Who Can Access', 'brizy' ); ?></label>
                </th>
                <td>
                    <select name="brizy_maintenance_role_access" id="brizy-maintenance-role-access">
                        <option value="logged"<?php selected( $access, 'logged' ); ?>><?php _e( 'Logged In', 'brizy' ); ?></option>
                        <option value="custom"<?php selected( $access, 'custom' ); ?>><?php _e( 'Custom', 'brizy' ); ?></option>
                    </select>
                </td>
            </tr>
            <tr>
                <th>
	                <?php _e( 'Roles', 'brizy' ); ?>
                </th>
                <td>
                    <fieldset>
		                <?php foreach ( $roles as $role ) : ?>
                            <label>
                                <input type="checkbox" name="brizy-roles[]" value="<?php echo $role['id']; ?>"<?php checked( in_array( $role['id'], $access_roles ) ); ?>>
				                <?php echo $role['name']; ?>
                            </label>
                            <br>
                        <?php endforeach; ?>
                    </fieldset>
                </td>
            </tr>
            <tr>
                <th>
                    <label for="brizy-maintenance-template"><?php _e( 'Choose Template', 'brizy' ); ?></label>
                </th>
                <td>
                    <select name="brizy_maintenance_role_access" id="brizy-maintenance-template">
                        <option value=""<?php selected( $template, '' ); ?>><?php _e( '— Select —', 'brizy' ); ?></option>
                        <option value="brizy_template"<?php selected( $template, 'brizy_template' ); ?>><?php _e( 'A', 'brizy' ); ?></option>
                    </select>
                </td>
            </tr>
		</tbody>
	</table>

	<p class="submit">
		<button type="submit"
		        id="submit"
		        class="button button-primary"
		><?php echo __( 'Save Changes', 'brizy' ); ?></button>
	</p>
</form>
