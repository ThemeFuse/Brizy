<ul class="formData">
    <?php foreach ( $data->formData as $field ) : ?>
        <?php $label = isset( $field->label ) ? $field->label : __( 'No Label', 'brizy' ); ?>
        <?php $type  = isset( $field->type ) ? $field->type : 'Text'; ?>
        <li>
            <label for="<?php echo $field->name; ?>">
                <?php echo $label; ?>
            </label>:
            <?php if ( $type == 'FileUpload' ): ?>
                <span id="<?php echo $field->name; ?>">
                    <a href="<?php echo $field->value; ?>" target="_blank">
                        <?php echo $field->value; ?>
                    </a>
                </span>
            <?php else: ?>
                <span id="<?php echo $field->name; ?>" class="formData-<?php echo strtolower( esc_attr( $type ) ); ?>">
                    <?php echo strip_tags( $field->value, '<br>' ); ?>
                </span>
            <?php endif; ?>
        </li>
    <?php endforeach; ?>
</ul>
<style>
    .formData {
        margin: 0;
    }

    .formData label {
        font-weight: bold;
    }

    .formData span {
        vertical-align: middle;
    }

    .formData .formData-paragraph {
        display: block;
        height: auto;
        max-height: 100px;
        overflow: auto;
        padding-left: 10px;
        padding-top: 5px;
        padding-bottom: 10px;
    }
</style>