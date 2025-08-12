<?php

use BrizyPlaceholders\ContentPlaceholder;
use BrizyPlaceholders\ContextInterface;

class Brizy_Content_Placeholders_GlobalBlockAnchor extends Brizy_Content_Placeholders_Abstract {
	static $cache = [];

	public function __construct(
		$label, $placeholder, $group = null, $display = Brizy_Content_Placeholders_Abstract::DISPLAY_INLINE, $attrs = []
	) {
		$this->setLabel( $label );
		$this->setPlaceholder( $placeholder );
		$this->setDisplay( $display );
		$this->setGroup( $group );
		$this->setAttributes( $attrs );
	}

	/**
	 * @param ContextInterface $context
	 * @param ContentPlaceholder $placeholder
	 *
	 * @return string
	 * @throws Exception
	 */
	public function getValue( ContextInterface $context, ContentPlaceholder $placeholder ) {

		if ( ! $uid = $placeholder->getAttribute( 'uid' ) ) {
			return '';
		}

        if ( isset( self::$cache[ $uid ] ) ) {
            return self::$cache[ $uid ];
        }

        $blockManager = new Brizy_Admin_Blocks_Manager( Brizy_Admin_Blocks_Main::CP_GLOBAL );

        if ( ! $block = $blockManager->getEntity( $uid ) ) {
            return self::$cache[ $uid ] = $uid;
        }

        $data = json_decode($block->getEditorData(true), true);

        if (empty($data['value']['anchorName'])) {
            return self::$cache[ $uid ] = $uid;
        }

        return self::$cache[ $uid ] = esc_attr($data['value']['anchorName']);
	}
}