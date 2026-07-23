<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

/**
 * Sanitizes the compiled asset tree before it is stored.
 *
 * The asset content ends up in the page unescaped: 'code' assets are echoed in
 * wp_head/wp_footer, 'inline' assets are printed inside <style>/<script> tags.
 * Authors without the unfiltered_html capability must not be able to place
 * executable content there.
 */
class Brizy_Editor_AssetSanitizer {

	const TYPE_INLINE = 'inline';
	const TYPE_CODE = 'code';
	const TYPE_FILE = 'file';

	/**
	 * Slots of an asset group that hold one or more assets.
	 * 'main' holds a single asset, the others hold lists.
	 */
	private $assetSlots = array( 'main', 'generic', 'libsMap', 'pageStyles', 'pageFonts' );

	/**
	 * Asset groups whose 'inline' content is CSS. Any other group is treated as
	 * javascript, which cannot be made safe by filtering and is dropped instead.
	 */
	private $styleGroups = array( 'freeStyles', 'proStyles' );

	private $allowedAttributes = array(
		'class',
		'media',
		'type',
		'defer',
		'async',
		'crossorigin',
		'rel',
		'as',
		'sizes',
		'hreflang',
		'id',
		'charset',
		'integrity',
		'referrerpolicy',
	);

	/**
	 * Brizy loads its stylesheets with media="print" and swaps them in on load.
	 * This is the only event handler allowed to survive.
	 */
	const SAFE_ONLOAD_PATTERN = '/^this\.media=([\'"])[a-z]+\1;?$/i';

	/**
	 * @param array $assets The 'assets' member of a compiled block.
	 *
	 * @return array
	 */
	public function sanitizeAssets( $assets ) {

		if ( ! is_array( $assets ) ) {
			return array();
		}

		foreach ( $assets as $groupName => $group ) {

			if ( ! is_array( $group ) ) {
				continue;
			}

			$isStyleGroup = in_array( $groupName, $this->styleGroups, true );

			foreach ( $this->assetSlots as $slot ) {

				if ( ! isset( $group[ $slot ] ) || ! is_array( $group[ $slot ] ) ) {
					continue;
				}

				if ( $slot === 'main' ) {
					// a group without a main asset is discarded by the aggregator and
					// Asset::instanceFromJsonData() rejects a null, so an unsafe main is
					// emptied in place and never dropped
					$group[ $slot ] = $this->sanitizeAsset( $group[ $slot ], $isStyleGroup, true );
					continue;
				}

				$sanitized = array();
				foreach ( $group[ $slot ] as $asset ) {
					if ( ( $asset = $this->sanitizeAsset( $asset, $isStyleGroup ) ) !== null ) {
						$sanitized[] = $asset;
					}
				}
				$group[ $slot ] = array_values( $sanitized );
			}

			if ( isset( $group['libsSelectors'] ) && is_array( $group['libsSelectors'] ) ) {
				$group['libsSelectors'] = array_map( 'sanitize_text_field', $group['libsSelectors'] );
			}

			$assets[ $groupName ] = $group;
		}

		return $assets;
	}

	/**
	 * @param array $asset
	 * @param bool $isStyleGroup
	 * @param bool $keep When the caller cannot accept a null, the asset is emptied instead of dropped.
	 *
	 * @return array|null Null when the asset must be dropped.
	 */
	private function sanitizeAsset( $asset, $isStyleGroup, $keep = false ) {

		if ( ! is_array( $asset ) ) {
			return null;
		}

		if ( isset( $asset['name'] ) ) {
			$asset['name'] = preg_replace( '/[^A-Za-z0-9_\-]/', '', (string) $asset['name'] );
		}

		if ( isset( $asset['score'] ) ) {
			$asset['score'] = (int) $asset['score'];
		}

		if ( ! isset( $asset['content'] ) || ! is_array( $asset['content'] ) ) {
			return $asset;
		}

		$type = isset( $asset['content']['type'] ) ? (string) $asset['content']['type'] : '';

		if ( isset( $asset['content']['attr'] ) ) {
			$asset['content']['attr'] = $this->sanitizeAttributes( $asset['content']['attr'] );
		}

		switch ( $type ) {

			case self::TYPE_CODE:
				if ( isset( $asset['content']['content'] ) ) {
					$asset['content']['content'] = wp_kses(
						$this->stripExecutableBlocks( $asset['content']['content'] ),
						$this->getAllowedCodeTags()
					);
				}
				break;

			case self::TYPE_INLINE:
				// inline content of a script group is javascript and cannot be filtered
				if ( ! $isStyleGroup ) {
					return $keep ? $this->emptyContent( $asset ) : null;
				}
				if ( isset( $asset['content']['content'] ) ) {
					$asset['content']['content'] = $this->sanitizeCss( $asset['content']['content'] );
				}
				break;

			case self::TYPE_FILE:
				if ( isset( $asset['content']['url'] ) ) {
					$url = esc_url_raw( (string) $asset['content']['url'], array( 'http', 'https' ) );
					if ( $url === '' && (string) $asset['content']['url'] !== '' ) {
						return $keep ? $this->emptyContent( $asset ) : null;
					}
					$asset['content']['url'] = $url;
				}
				break;
		}

		return $asset;
	}

	/**
	 * Empties the payload of an asset that cannot be dropped. The key set is left
	 * alone because Asset::instanceFromJsonData() rejects both unknown and missing
	 * keys, so a rebuilt asset would throw where the original does not.
	 *
	 * @param array $asset
	 *
	 * @return array
	 */
	private function emptyContent( $asset ) {

		if ( array_key_exists( 'content', $asset['content'] ) ) {
			$asset['content']['content'] = '';
		}

		if ( array_key_exists( 'url', $asset['content'] ) ) {
			$asset['content']['url'] = '';
		}

		return $asset;
	}

	/**
	 * The default post allow list has no meta/link tags, which would strip the
	 * viewport meta and the font prefetch links that Brizy legitimately emits.
	 *
	 * @return array
	 */
	private function getAllowedCodeTags() {

		$tags = wp_kses_allowed_html( 'post' );

		unset( $tags['script'], $tags['iframe'], $tags['object'], $tags['embed'], $tags['form'], $tags['base'] );

		// http-equiv is intentionally omitted, it allows refresh redirects
		$tags['meta'] = array(
			'name'     => true,
			'content'  => true,
			'charset'  => true,
			'property' => true,
			'itemprop' => true,
			'class'    => true,
		);

		$tags['link'] = array(
			'rel'         => true,
			'href'        => true,
			'class'       => true,
			'as'          => true,
			'type'        => true,
			'media'       => true,
			'crossorigin' => true,
			'sizes'       => true,
			'hreflang'    => true,
			'id'          => true,
		);

		return $tags;
	}

	/**
	 * Removes executable elements together with their content.
	 *
	 * wp_kses() drops the disallowed tags but keeps the text between them, which
	 * would leave the script body behind as loose text.
	 *
	 * @param string $content
	 *
	 * @return string
	 */
	private function stripExecutableBlocks( $content ) {

		return preg_replace(
			'#<\s*(script|style|iframe|object|embed|noscript|template)\b[^>]*>.*?<\s*/\s*\1\s*>#is',
			'',
			(string) $content
		);
	}

	/**
	 * @param string $css
	 *
	 * @return string
	 */
	private function sanitizeCss( $css ) {

		// closes the </style><script> break out
		$css = wp_strip_all_tags( (string) $css );

		$css = preg_replace( '/expression\s*\(/i', '(', $css );
		$css = preg_replace( '/behavior\s*:/i', '', $css );
		$css = preg_replace( '/@import\b/i', '', $css );

		// data: is left alone, it is used for embedded fonts and svg backgrounds
		$css = preg_replace( '/(javascript|vbscript)\s*:/i', '', $css );

		return $css;
	}

	/**
	 * @param array $attributes
	 *
	 * @return array
	 */
	private function sanitizeAttributes( $attributes ) {

		if ( ! is_array( $attributes ) ) {
			return array();
		}

		$filtered = array();

		foreach ( $attributes as $key => $value ) {

			$key = strtolower( trim( (string) $key ) );

			if ( $key === 'onload' && preg_match( self::SAFE_ONLOAD_PATTERN, (string) $value ) ) {
				$filtered[ $key ] = $value;
				continue;
			}

			if ( ! in_array( $key, $this->allowedAttributes, true ) && ! preg_match( '/^data-brz[a-z0-9_\-]*$/', $key ) ) {
				continue;
			}

			if ( is_bool( $value ) ) {
				$filtered[ $key ] = $value;
				continue;
			}

			// quotes and angle brackets would allow breaking out of the attribute
			// when the tag is assembled in Brizy_Public_AssetEnqueueManager
			$filtered[ $key ] = str_replace(
				array( '"', "'", '<', '>' ),
				'',
				sanitize_text_field( (string) $value )
			);
		}

		return $filtered;
	}
}
