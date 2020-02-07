<?php defined( 'ABSPATH' ) or die(); ?>

<form method="post" novalidate="novalidate">
	<input type="hidden" name="tab" value="maintenance"/>
	<?php wp_nonce_field() ?>
	<table class="form-table">
		<tbody>
            <tr id="brizy-maintenance-js-mode">
                <th>
                    <label for="brizy-maintenance-mode"><?php _e( 'Choose Mode', 'brizy' ); ?></label>
                </th>
                <td>
                    <select name="brizy-maintenance[mode]" id="brizy-maintenance-mode">
                        <option value=""<?php selected( $mode, '' ); ?>><?php _e( 'Disabled', 'brizy' ); ?></option>
                        <option value="coming_soon"<?php selected( $mode, 'coming_soon' ); ?>><?php _e( 'Coming Soon', 'brizy' ); ?></option>
                        <option value="maintenance"<?php selected( $mode, 'maintenance' ); ?>><?php _e( 'Maintenance', 'brizy' ); ?></option>
                    </select>
                </td>
            </tr>
            <tr class="hidden">
                <th>
                    <label for="brizy-maintenance-access-role"><?php _e( 'Who Can Access', 'brizy' ); ?></label>
                </th>
                <td>
                    <select name="brizy-maintenance[who]" id="brizy-maintenance-access-role">
                        <option value="logged"<?php selected( $who, 'logged' ); ?>><?php _e( 'Logged In', 'brizy' ); ?></option>
                        <option value="custom"<?php selected( $who, 'custom' ); ?>><?php _e( 'Custom', 'brizy' ); ?></option>
                    </select>
                </td>
            </tr>
            <tr class="brizy-maintenance-roles hidden">
                <th>
	                <?php _e( 'Roles', 'brizy' ); ?>
                </th>
                <td>
                    <fieldset>
		                <?php foreach ( $available_roles as $role ) : ?>
                            <label>
                                <input type="checkbox" name="brizy-maintenance[roles][]" value="<?php echo $role['id']; ?>"<?php checked( in_array( $role['id'], $roles ) ); ?>>
				                <?php echo $role['name']; ?>
                            </label>
                            <br>
                        <?php endforeach; ?>
                    </fieldset>
                </td>
            </tr>
            <tr class="hidden">
                <th>
                    <label for="brizy-maintenance-page"><?php _e( 'Choose a Page', 'brizy' ); ?></label>
                </th>
                <td>
	                <?php if ( $pages ) : ?>
                        <select name="brizy-maintenance[page]" id="brizy-maintenance-page">
                            <option value=""<?php selected( $page, '' ); ?>><?php _e( 'Select a page', 'brizy' ); ?></option>
			                <?php foreach ( $pages as $id => $title ) : ?>
                                <option value="<?php echo $id; ?>"<?php selected( $page, $id ); ?>><?php echo $title; ?></option>
			                <?php endforeach; ?>
                        </select>
	                <?php else : ?>
		                <?php printf( __( 'You have no pages. Please %s create %s one.', 'brizy' ), '<a href="' . admin_url( 'post-new.php?post_type=page' ) . '">', '</a>' ); ?>
	                <?php endif; ?>
                </td>
            </tr>
            <tr class="hidden">
                <th>
                    <label for="brizy-maintenance-ips"><?php _e( 'Whitelisted IP Addresses', 'brizy' ); ?></label>
                </th>
                <td>
                    <textarea name="brizy-maintenance[ips]" id="brizy-maintenance-ips" cols="25" rows="3" placeholder="122.45.23.22&#10;122.45.25.211"><?php echo $ips; ?></textarea>
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
