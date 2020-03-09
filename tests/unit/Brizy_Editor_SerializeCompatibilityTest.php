<?php


class Brizy_Editor_SerializeCompatibility extends \Codeception\TestCase\WPTestCase {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	public function fixSerializeCompatibilityParameters() {
		return [
			[
				'brizy-project',
				'a:1:{i:0;O:24:"Brizy_Editor_Forms_Field":6:{a:0:{}}}',
				'a:1:{i:0;C:24:"Brizy_Editor_Forms_Field":6:{a:0:{}}}'
			],
			[
				'some_meta_value',
				'a:1:{i:0;O:24:"Brizy_Editor_Forms_Field":6:{a:0:{}}}',
				'a:1:{i:0;O:24:"Brizy_Editor_Forms_Field":6:{a:0:{}}}'
			],
			[
				'brizy-project',
				'a:1:{i:0;C:24:"Brizy_Editor_Forms_Field":6:{a:0:{}}}',
				'a:1:{i:0;C:24:"Brizy_Editor_Forms_Field":6:{a:0:{}}}'
			],
			[
				'brizy-project',
				'a:1:{i:0;C:24:"Editor_Forms_Field":6:{a:0:{}}}',
				'a:1:{i:0;C:24:"Editor_Forms_Field":6:{a:0:{}}}'
			],
			[
				'brizy-project',
				'a:1:{i:0;O:24:"Editor_Forms_Field":6:{a:0:{}}}',
				'a:1:{i:0;O:24:"Editor_Forms_Field":6:{a:0:{}}}'
			],
			[
				'brizy-project',
				'a:0:{}',
				'a:0:{}'
			],
		];
	}

	public function fixSerializeParameters() {
		return [
			[
				'a:1:{i:0;O:24:"Brizy_Editor_Forms_Field":6:{a:0:{}}}',
				'a:1:{i:0;C:24:"Brizy_Editor_Forms_Field":6:{a:0:{}}}'
			],
			[
				'a:1:{i:0;O:24:"Editor_Forms_Field":6:{a:0:{}}}',
				'a:1:{i:0;O:24:"Editor_Forms_Field":6:{a:0:{}}}'
			],
			[
				'a:1:{i:0;C:24:"Editor_Forms_Field":6:{a:0:{}}}',
				'a:1:{i:0;C:24:"Editor_Forms_Field":6:{a:0:{}}}'
			],
			[
				'a:0:{}',
				'a:0:{}'
			],
		];
	}

	/**
	 * @dataProvider fixSerializeParameters
	 */
	public function test_fixSerializedData( $meta_key, $input, $expectedOutput ) {
		$m      = new Brizy_Compatibilities_Serialize();
		$output = $m->fixSerializedData( $input );

		$this->assertEquals( $expectedOutput, $output, 'It should return the correct serialized string' );
	}

}
