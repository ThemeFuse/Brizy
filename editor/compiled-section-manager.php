<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_CompiledSectionManager {

	use Brizy_Editor_Trait_Sanitize;

	private $data = array();


	public function __construct( $compliedSectionsJson ) {
		$this->data = json_decode( $compliedSectionsJson, true ) ?: [];
	}

	public function merge( array $compiledSections, $capabilityIgnore = false ) {
		$this->data['rootClassNames'] = isset( $compiledSections['rootClassNames'] ) ? array_map( 'sanitize_html_class', $compiledSections['rootClassNames'] ) : [];
		$this->data['rootAttributes'] = isset( $compiledSections['rootAttributes'] ) ? $this->sanitizeRootAttributes( $compiledSections['rootAttributes'] ) : [];
		foreach ( $compiledSections['blocks'] as &$block ) {
			if ( $block['html'] == '' ) {
				$block['html']   = $this->getSection( $block['id'] )['html'];
				$block['assets'] = $this->getSection( $block['id'] )['assets'];
				continue;
			}
			$block['html'] = Brizy_SiteUrlReplacer::hideSiteUrl( $this->sanitizeHtml( $block['html'], $capabilityIgnore ) );

			// hide the site url in the assets
			if ( isset( $block['assets']['freeStyles']['generic'] )  ) {
				foreach ( $block['assets']['freeStyles']['generic'] as &$asset ) {
					if( $asset['content']['type'] === 'inline' || $asset['content']['type'] === 'code')
					{
						$asset['content']['content'] = Brizy_SiteUrlReplacer::hideSiteUrl( $asset['content']['content'] );
					}
				}
			}
			if ( isset( $block['assets']['proStyles']['generic'] )  ) {
				foreach ( $block['assets']['proStyles']['generic'] as &$asset ) {
					if( $asset['content']['type'] === 'inline' || $asset['content']['type'] === 'code')
					{
						$asset['content']['content'] = Brizy_SiteUrlReplacer::hideSiteUrl( $asset['content']['content'] );
					}
				}
			}
		}
		$this->data['blocks'] = $compiledSections['blocks'];
	}

	public function getSections() {
		if ( isset( $this->data['blocks'] ) ) {
			return $this->data['blocks'];
		}

		return [];
	}

	private function getSection( $id ) {
		foreach ( (array) $this->data['blocks'] as $block ) {
			if ( $block['id'] == $id ) {
				return $block;
			}
		}

		return null;
	}

	private function deleteSection( $id ) {
		foreach ( (array) $this->data['blocks'] as $i => $block ) {
			if ( $block['id'] == $id ) {
				$this->data['blocks'] = array_splice( $this->data['blocks'], $i, 1 );
			}
		}
	}

	private function updateSection( $id, $html, $assets ) {
		foreach ( (array) $this->data['blocks'] as $i => &$block ) {
			if ( $block['id'] == $id ) {
				$block['html']   = $html;
				$block['assets'] = $assets;
			}
		}
	}

	public function asJson() {
		return json_encode( $this->data );
	}

	/**
	 * This method will return the block(s) html only.
	 *
	 * @return string
	 */
	public function buildHtml() {
		if ( isset( $this->data['blocks'] ) ) {
			return implode( "\n", array_map( function ( $block ) {
				return $block['html'];
			}, $this->data['blocks'] ) );
		}

		return '';
	}

	/**
	 * This method will return the block(s) html wrapped in page div and including global blocks placeholders.
	 * @return string
	 */
	public function getHtml() {
		$classStr = esc_attr( implode( ' ', array_map( 'sanitize_html_class', $this->data['rootClassNames'] ?: [] ) ) );
		$attribs  = $this->sanitizeRootAttributes( $this->data['rootAttributes'] ?: [] );
		$attrStr  = $this->buildAttributeString( $attribs );
		$html     = $this->buildHtml();

		return "<div class=\"{$classStr}\" {$attrStr}>{{ brizy_dc_global_blocks position=\"top\" }} {$html} {{ brizy_dc_global_blocks position=\"bottom\" }}</div>";
	}

	public function wrapHtml( $content ) {
		$classStr = esc_attr( implode( ' ', array_map( 'sanitize_html_class', isset( $this->data['rootClassNames'] ) ? $this->data['rootClassNames'] : [] ) ) );
		$attribs  = $this->sanitizeRootAttributes( isset( $this->data['rootAttributes'] ) ? $this->data['rootAttributes'] : [] );
		$attrStr  = $this->buildAttributeString( $attribs );

		return "<div class=\"{$classStr}\" {$attrStr}>{$content}</div>";
	}

	private function sanitizeRootAttribute( $value ) {
		if ( is_bool( $value ) ) {
			return $value;
		}

		return sanitize_text_field( (string) $value );
	}

	private function sanitizeRootAttributes( $attributes ) {
		if ( ! is_array( $attributes ) ) {
			return [];
		}

		$filtered = [];

		foreach ( $attributes as $key => $value ) {
			$key = strtolower( trim( (string) $key ) );

			if ( preg_match( '/^data-brz(-[a-z0-9_]+)+$/', $key ) ) {
				$filtered[ $key ] = $value;
			}
		}

		return array_map( [ $this, 'sanitizeRootAttribute' ], $filtered );
	}

	private function buildAttributeString( $attribs ) {
		return array_reduce( array_keys( $attribs ),
			function ( $carry, $key ) use ( $attribs ) {
				return $carry . ' ' . esc_attr( $key ) . '="' . esc_attr( $attribs[ $key ] ) . '"';
			}, '' );
	}

	public function getAssetsGroups() {
		$groups = [];
		if ( isset( $this->data['blocks'] ) ) {
			$blocsAssets = array_map( function ( $block ) {
				return isset( $block['assets'] ) ? $block['assets'] : [];
			}, $this->data['blocks'] );
			foreach ( $blocsAssets as $key => $blockAssetGroup ) {
				foreach ( $blockAssetGroup as $key2 => $assetGroup ) {
					$groups[ $key2 ][] = \BrizyMerge\Assets\AssetGroup::instanceFromJsonData( $assetGroup );

				}
			}

		}

		return $groups;
	}

}
