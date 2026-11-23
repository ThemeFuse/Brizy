<?php


class Brizy_Editor_Exceptions_ExceptionTest extends \Codeception\TestCase\WPTestCase {

	/**
	 * @var \UnitTester
	 */
	protected $tester;

	public function testSerializeRoundTrip() {
		$exception = new Brizy_Editor_Exceptions_UnsupportedPostType( 'Unsupported post type' );

		$restored = unserialize( serialize( [ 'exception' => $exception ] ) )['exception'];

		$this->assertInstanceOf( Brizy_Editor_Exceptions_UnsupportedPostType::class, $restored );
		$this->assertEquals( 'Unsupported post type', $restored->getMessage() );
		$this->assertEquals( 404, $restored->getCode() );
	}

	public function testSerializeIgnoresNonSerializableTraceArgs() {
		$throw = function ( $callback ) {
			throw new Brizy_Editor_Exceptions_NotFound( 'not found' );
		};

		try {
			$throw( function () {
			} );
		} catch ( Brizy_Editor_Exceptions_NotFound $e ) {
			$this->assertEquals( 'not found', unserialize( serialize( $e ) )->getMessage() );

			return;
		}

		$this->fail( 'Exception was not thrown' );
	}

	public function testLegacySerializableMethods() {
		$exception = new Brizy_Editor_Exceptions_AccessDenied( 'denied' );
		$restored  = ( new ReflectionClass( $exception ) )->newInstanceWithoutConstructor();
		$restored->unserialize( $exception->serialize() );

		$this->assertEquals( 'denied', $restored->getMessage() );
		$this->assertEquals( 401, $restored->getCode() );
	}
}
