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
            <tr>
                <th>
                    <label for="brizy-maintenance-template"><?php _e( 'Whitelisted IP Addresses', 'brizy' ); ?></label>
                </th>
                <td>
                    <textarea name="brizy_maintenance_ips" id="brizy-maintenance-ips" cols="25" rows="3" placeholder="122.45.23.22&#10;122.45.25.211"></textarea>
                </td>
            </tr>
            <tr>
                <th>
                    <label for=""><?php _e( 'Direct Access Links', 'brizy' ); ?></label>
                </th>
                <td>
	                <?php
                        $links = [
                            [
	                            'name'   => 'First Link Name',
	                            'link'   => 'http://brizy.local/?ucp-access=85abd217',
	                            'expire' => 'expires after December 31, 2019 @ 11:13 am'
                            ]
                        ]
                    ?>
                    <?php if ( empty( $links ) ) : ?>
	                    <?php _e( 'There are no links', 'brizy' ); ?>
                    <?php else : ?>
                        <table class="wp-list-table widefat fixed brz-maintenance-table-access-links">
                            <tr class="">
                                <th class="brz-maintenance-delete-links">
                                    <a data-tooltip="<?php _e( 'Delete all direct access links', 'brizy' ); ?>" class="js-action delete-action delete-all-access-links" href="#">
                                        <span class="dashicons dashicons-trash"></span>
                                    </a>
                                </th>
                                <th><?php _e( 'Name / Description', 'brizy' ); ?></th>
                                <th><?php _e( 'Link', 'brizy' ); ?></th>
                                <th><?php _e( 'Expire Rule', 'brizy' ); ?></th>
                            </tr>

                            <?php foreach ( $links as $link ) : ?>
                                <tr data-link-id="1" data-link-name="Test link" data-link-expire-type="date" data-link-expire-value="2019-12-31 11:13">
                                    <td class="">
                                        <a data-tooltip="Edit direct access link" class="js-action edit-action edit-access-link" href="#">
                                            <span class="dashicons dashicons-edit"></span>
                                        </a>
                                        <a data-tooltip="Delete direct access link" class="js-action delete-action delete-access-link" href="#">
                                            <span class="dashicons dashicons-trash"></span>
                                        </a>
                                    </td>
                                    <td>
	                                    <?php echo $link['name']; ?>
                                    </td>
                                    <td>
                                        <code class="clipboard-copy tooltipped" title="Click to copy link to clipboard" data-tooltip="Click to copy link to clipboard" data-clipboard-text="http://brizy.local/?ucp-access=85abd217"><?php echo $link['link']; ?></code>
                                    </td>
                                    <td><?php echo $link['expire']; ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </table>
                    <?php endif; ?>
                </td>
            </tr>
		</tbody>
	</table>
	<p class="submit">
		<button type="submit" id="submit" class="button button-primary">
            <?php echo __( 'Save Changes', 'brizy' ); ?>
        </button>
	</p>
</form>
