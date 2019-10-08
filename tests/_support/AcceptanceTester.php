<?php


/**
 * Inherited Methods
 * @method void wantToTest( $text )
 * @method void wantTo( $text )
 * @method void execute( $callable )
 * @method void expectTo( $prediction )
 * @method void expect( $prediction )
 * @method void amGoingTo( $argumentation )
 * @method void am( $role )
 * @method void lookForwardTo( $achieveValue )
 * @method void comment( $description )
 * @method \Codeception\Lib\Friend haveFriend( $name, $actorClass = null )
 *
 * @SuppressWarnings(PHPMD)
 */
class AcceptanceTester extends \Codeception\Actor {
	use _generated\AcceptanceTesterActions;

	/**
	 * Define custom actions here
	 */

	public function clickOnPublish() {
		$this->click( '.brz-ed-fixed-bottom-panel .brz-ed-fixed-bottom-panel__btn' );
	}

	public function waitForPublish() {
		$this->waitForText( 'Publish' );
	}

	public function waitForEditorToLoad() {
		$this->waitForElement( '.brz-ed-fixed-bottom-panel .brz-ed-fixed-bottom-panel__btn' );
	}
}
