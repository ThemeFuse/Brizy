<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_FocalPoint {

	const DEFAULT_VALUE = 50;
	const MIN_VALUE = 0;
	const MAX_VALUE = 100;

	/**
	 * Normalizes one focal point coordinate to an integer percent.
	 *
	 * The value is clamped before it is rounded so that out of range values
	 * ( including INF ) end up on the closest edge instead of on the default.
	 *
	 * @param mixed $value
	 * @param int $default
	 *
	 * @return int
	 */
	public static function sanitizeValue( $value, $default = self::DEFAULT_VALUE ) {

		if ( ! is_numeric( $value ) ) {
			return $default;
		}

		$value = (float) $value;

		if ( $value < self::MIN_VALUE ) {
			$value = self::MIN_VALUE;
		}

		if ( $value > self::MAX_VALUE ) {
			$value = self::MAX_VALUE;
		}

		return (int) round( $value );
	}

	/**
	 * Normalizes a focal point meta value coming from a request or from the database.
	 *
	 * Always returns a well formed array so callers can use the x and y keys
	 * without further checks.
	 *
	 * @param mixed $focalPoint
	 *
	 * @return array
	 */
	public static function sanitize( $focalPoint ) {

		if ( ! is_array( $focalPoint ) ) {
			return array( 'x' => self::DEFAULT_VALUE, 'y' => self::DEFAULT_VALUE );
		}

		return array(
			'x' => self::sanitizeValue( isset( $focalPoint['x'] ) ? $focalPoint['x'] : null ),
			'y' => self::sanitizeValue( isset( $focalPoint['y'] ) ? $focalPoint['y'] : null ),
		);
	}
}
