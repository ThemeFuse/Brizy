<?php


class CleanLogsMigrationCest {


	public function _before( FunctionalTester $I ) {
		wp_cache_flush();

		global $wpdb;
		$logsTable = "{$wpdb->prefix}brizy_logs";

		for ( $i = 0; $i < 20; $i ++ ) {
			$I->haveInDatabase( $logsTable, [
				'type'       => 'CRITICAL',
				'message'    => 'Some error message',
				'context'    => 'Context',
				'session_id' => 'asrt35ef234t34'
			] );
		}
	}

	public function cleanMigrationTest( FunctionalTester $I ) {

		global $wpdb;
		$logsTable = "{$wpdb->prefix}brizy_logs";

		$count = $I->countRowsInDatabase( $logsTable );
		$I->assertTrue( $count >= 20, $logsTable . ' should contain at least 20 records' );

		Brizy_Logger::clean();

		$count = $I->countRowsInDatabase( $logsTable );
		$I->assertEquals( 0, $count, $logsTable . ' should not contain any rows after clean call' );
	}
}