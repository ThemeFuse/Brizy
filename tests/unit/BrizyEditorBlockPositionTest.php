<?php

class BrizyEditorBlockPositionTest extends \Codeception\Test\Unit {
	/**
	 * @var \UnitTester
	 */
	protected $tester;

	public function positionPropertiesData() {
		return [
			[ 0, 0, '' ],
			[ 0, 1, 'top' ],
			[ 1, 2, 'bottom' ],
			[ null, null, null ],
		];
	}

	/**
	 * @dataProvider positionPropertiesData
	 *
	 * @param $top
	 * @param $bottom
	 * @param $align
	 */
	public function testConstructorProperties( $top, $bottom, $align ) {
		$position = new Brizy_Editor_BlockPosition( $top, $bottom, $align );
		$this->tester->assertEquals( $top, $position->getTop() );
		$this->tester->assertEquals( $bottom, $position->getBottom() );
		$this->tester->assertEquals( $align, $position->getAlign() );
	}

	public function testCreateFromSerializedData() {

		$forSerialization = [
			'top'    => 1,
			'bottom' => 2,
			'align'  => 'top'
		];

		$position = Brizy_Editor_BlockPosition::createFromSerializedData( $forSerialization );
		$this->tester->assertEquals( (int) $forSerialization['top'], $position->getTop() );
		$this->tester->assertEquals( (int) $forSerialization['bottom'], $position->getBottom() );
		$this->tester->assertEquals( $forSerialization['align'], $position->getAlign() );
	}

	/**
	 * @dataProvider positionPropertiesData
	 *
	 * @param $top
	 * @param $bottom
	 * @param $align
	 */
	public function testProperties( $top, $bottom, $align ) {
		$position = new Brizy_Editor_BlockPosition();

		$this->tester->assertNull( $position->getTop() );
		$this->tester->assertNull( $position->getBottom() );
		$this->tester->assertNull( $position->getAlign() );

		$position->setTop( $top );
		$position->setBottom( $bottom );
		$position->setAlign( $align );

		$this->tester->assertEquals( $top, $position->getTop() );
		$this->tester->assertEquals( $bottom, $position->getBottom() );
		$this->tester->assertEquals( $align, $position->getAlign() );
	}

	public function testSerialize() {
		$data = [ 1, 2, 'bottom' ];
		list( $top, $bottom, $align ) = $data;
		$position = new Brizy_Editor_BlockPosition( $top, $bottom, $align );

		$forSerialization = [
			'top'    => $top,
			'bottom' => $bottom,
			'align'  => $align
		];
		$this->assertEquals( $forSerialization, unserialize($position->serialize()), 'The Serialize method should return all properties' );
		$this->assertEquals( $forSerialization, $position->jsonSerialize(), 'The jsonSerialize method should return all properties' );
		$this->assertEquals( $forSerialization, $position->convertToOptionValue(), 'The convertToOptionValue method should return all properties' );
	}

}

