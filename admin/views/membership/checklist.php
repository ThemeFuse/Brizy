<?php
/**
 * Output the roles checklist.
 *
 * @var $roles array All WordPress roles in name => label pairs.
 * @var $user_roles array An array of role names belonging to the current user.
 */
$creating = isset( $_POST['createuser'] );
$selected_roles = $creating && isset( $_POST['editor_multiple_roles'] ) ? wp_unslash( $_POST['editor_multiple_roles'] ) : '';
?>

<div class="editor-checklist-roles" style="display:none;">
	<?php foreach( $roles as $name => $label ) :
		$input_uniq_id = uniqid(); ?>
		<label for="editor-multiple-roles-<?php echo esc_attr( $name ) . '-' . $input_uniq_id; ?>">
			<input
				id="editor-multiple-roles-<?php echo esc_attr( $name ) . '-' . $input_uniq_id; ?>"
				type="checkbox"
				name="editor_multiple_roles[]"
				value="<?php echo esc_attr( $name ); ?>"
				<?php if ( ! is_null( $user_roles ) ) : // Edit user page
					checked( in_array( $name, $user_roles ) );
				elseif ( ! empty( $selected_roles ) ) : // Add new user page
					checked( in_array( $name, $selected_roles ) );
				endif; ?>
			/>
			<?php echo esc_html( translate_user_role( $label ) ); ?>
		</label>
		<br />
	<?php endforeach; ?>
</div>