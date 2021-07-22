<?php

class Brizy_Logger {

	const EMERGENCY_LOG = 'EMERGENCY';
	const ALERT_LOG = 'ALERT';
	const CRITICAL_LOG = 'CRITICAL';
	const ERROR_LOG = 'ERROR';
	const WARNING_LOG = 'WARNING';
	const NOTICE_LOG = 'NOTICE';
	const INFO_LOG = 'INFO';
	const DEBUG_LOG = 'DEBUG';

	/**
	 * @var self
	 */
	static protected $instance = null;

	/**
	 * Get logger instance.
	 */
	static public function instance() {

		if ( self::$instance ) {
			return self::$instance;
		}

		return self::$instance = new self();
	}


	/**
	 * Create logger table.
	 */
	static public function install() {

		global $wpdb;

		$tableName = "{$wpdb->prefix}brizy_logs";

		if ( ! function_exists( 'maybe_create_table' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		}

		$create_table_query = "
            CREATE TABLE {$tableName} (
              `id` bigint  PRIMARY KEY AUTO_INCREMENT,
              `type` text NOT NULL,
              `message` text NOT NULL,
              `context` text NOT NULL,              
              `session_id` text NOT NULL,            
              `date` datetime NOT NULL            
            ) DEFAULT CHARSET=utf8;";

		maybe_create_table( $tableName, $create_table_query );

		self::clean();
	}


	/**
	 * Create logger table.
	 */
	static public function clean() {

		global $wpdb;
		$wpdb->query( "TRUNCATE `{$wpdb->prefix}brizy_logs`" );
	}


	/**
	 * @param $type
	 * @param $message
	 * @param array $context
	 */
	private function write_log( $type, $message, $context = array() ) {
		global $wpdb;

		if ( ! BRIZY_LOG && ! in_array( $type, [
				self::EMERGENCY_LOG,
				self::ALERT_LOG,
				self::CRITICAL_LOG,
				self::ERROR_LOG,
			] ) ) {
			return;
		}

		$wpdb->insert( "{$wpdb->prefix}brizy_logs", array(
			'type'       => $type,
			'message'    => $message,
			'context'    => serialize( $context ),
			'session_id' => session_id(),
			'date'       => current_time( 'mysql', 1 )
		), array( '%s', '%s', '%s', '%s', '%s' ) );
	}

	/**
	 * System is unusable.
	 *
	 * @param string $message
	 * @param array $context
	 *
	 * @return void
	 */
	public function emergency( $message, array $context = array() ) {
		$this->log( self::EMERGENCY_LOG, $message, $context );
	}

	/**
	 * Action must be taken immediately.
	 *
	 * Example: Entire website down, database unavailable, etc. This should
	 * trigger the SMS alerts and wake you up.
	 *
	 * @param string $message
	 * @param array $context
	 *
	 * @return void
	 */
	public function alert( $message, array $context = array() ) {
		$this->log( self::ALERT_LOG, $message, $context );
	}

	/**
	 * Critical conditions.
	 *
	 * Example: Application component unavailable, unexpected exception.
	 *
	 * @param string $message
	 * @param array $contextgt
	 *
	 * @return void
	 */
	public function critical( $message, array $context = array() ) {
		$this->log( self::CRITICAL_LOG, $message, $context );
	}

	/**
	 * Runtime errors that do not require immediate action but should typically
	 * be logged and monitored.
	 *
	 * @param string $message
	 * @param array $context
	 *
	 * @return void
	 */
	public function error( $message, array $context = array() ) {
		$this->log( self::ERROR_LOG, $message, $context );
	}

	/**
	 * Exceptional occurrences that are not errors.
	 *
	 * Example: Use of deprecated APIs, poor use of an API, undesirable things
	 * that are not necessarily wrong.
	 *
	 * @param string $message
	 * @param array $context
	 *
	 * @return void
	 */
	public function warning( $message, array $context = array() ) {
		$this->log( self::WARNING_LOG, $message, $context );
	}

	/**
	 * Normal but significant events.
	 *
	 * @param string $message
	 * @param array $context
	 *
	 * @return void
	 */
	public function notice( $message, array $context = array() ) {
		$this->log( self::NOTICE_LOG, $message, $context );
	}

	/**
	 * Interesting events.
	 *
	 * Example: User logs in, SQL logs.
	 *
	 * @param string $message
	 * @param array $context
	 *
	 * @return void
	 */
	public function info( $message, array $context = array() ) {
		$this->log( self::INFO_LOG, $message, $context );
	}

	/**
	 * Detailed debug information.
	 *
	 * @param string $message
	 * @param array $context
	 *
	 * @return void
	 */
	public function debug( $message, array $context = array() ) {
		$this->log( self::DEBUG_LOG, $message, $context );
	}

	/**
	 * Logs with an arbitrary level.
	 *
	 * @param mixed $level
	 * @param string $message
	 * @param array $context
	 *
	 * @return void
	 */
	public function log( $level, $message, array $context = array() ) {
		$this->write_log( $level, $message, $context );
	}

	/**
	 * @param Exception $exception
	 */
	public function exception( \Exception $exception ) {
		$this->log( self::ERROR_LOG, $exception->getMessage(), array( $exception->getTraceAsString() ) );
	}
}