<?php

class Brizy_Admin_Symbols_Manager {
	const BRIZY_SYMBOLS_KEY = 'brizy-symbols';

	public function getByUID( $uid ) {
		global $wpdb;
		$row = $wpdb->get_row( $wpdb->prepare( "SELECT ID,post_content FROM $wpdb->posts WHERE post_type=%s and  post_name=%s", Brizy_Admin_Symbols_Main::CP_SYMBOL, $uid ) );
		if ( $row ) {
			$jsonObj = json_decode( base64_decode( $row->post_content ) );

			return Brizy_Admin_Symbols_Symbol::createFromJsonObject( $jsonObj, $row->ID );
		}

		return null;
	}

	/**
	 * @param $jsonString
	 * @param string $postType
	 *
	 * @return Brizy_Admin_Symbols_Symbol
	 * @throws Exception
	 */
	public function createFromJson( $jsonString ) {
		$jsonObj = json_decode( $jsonString );
		$result  = [];
		if ( is_array( $jsonObj ) ) {
			foreach ( $jsonObj as $obj ) {
				if ( ! is_null( $obj ) ) {
					$dbOne    = $this->getByUID( $obj->uid );
					$result[] = Brizy_Admin_Symbols_Symbol::createFromJsonObject( $obj, $dbOne ? $dbOne->getId() : null );
				}
			}

		} elseif ( ! is_null( $jsonObj ) ) {
			$dbOne    = $this->getByUID( $jsonObj->uid );
			$result[] = Brizy_Admin_Symbols_Symbol::createFromJsonObject( $jsonObj, $dbOne ? $dbOne->getId() : null );
		}

		return $result;
	}

	/**
	 * @return Brizy_Admin_Symbols_Symbol[]
	 */
	public function getList() {
		global $wpdb;
		$rows    = $wpdb->get_results( $wpdb->prepare( "SELECT ID,post_content FROM $wpdb->posts WHERE post_type=%s", Brizy_Admin_Symbols_Main::CP_SYMBOL ) );
		$symbols = [];
		foreach ( $rows as $symbolRow ) {
			$symbolJsonObj = json_decode( base64_decode( $symbolRow->post_content ) );
			if ( $symbolJsonObj ) {
				$symbols[] = Brizy_Admin_Symbols_Symbol::createFromJsonObject( $symbolJsonObj, $symbolRow->ID );
			} else {
				Brizy_Logger::instance()->error( 'Failed to decode symbol with ID ' . $symbolRow->ID );
			}
		}

		return $symbols;
	}

	/**
	 * @return Brizy_Admin_Symbols_Symbol[]
	 */
	public function getFiltered( array $uids ) {
		$result  = [];
		$symbols = $this->getList();
		foreach ( $symbols as $symbol ) {
			if ( in_array( $symbol->getUid(), $uids ) ) {
				$result[] = $symbol;
			}
		}

		return $result;
		global $wpdb;
		$placeholders = implode( ',', array_fill( 0, count( $uids ), '%s' ) );
		$params       = array_merge( [ Brizy_Admin_Symbols_Main::CP_SYMBOL ], $uids );
		$rows         = $wpdb->get_results( $wpdb->prepare( "SELECT ID,post_content FROM $wpdb->posts WHERE post_type=%s and post_name IN ($placeholders)", $params ) );
		foreach ( $rows as $symbolRow ) {
			$symbolJsonObj = json_decode( base64_decode( $symbolRow->post_content ) );
			if ( $symbolJsonObj ) {
				$symbols[] = Brizy_Admin_Symbols_Symbol::createFromJsonObject( $symbolJsonObj, $symbolRow->ID );
			} else {
				Brizy_Logger::instance()->error( 'Failed to decode symbol with ID ' . $symbolRow->ID );
			}
		}

		return $symbols;
	}


	/**
	 * @param Brizy_Admin_Symbols_Symbol $aSymbol
	 */
	public function deleteSymbol( $uid ) {
		if ( $symbol = $this->getByUID( $uid ) ) {
			wp_delete_post( (int) $symbol->getId(), true );
		} else {
			throw new Exception( "Unable to find symbol with uid: " . $uid );
		}
	}

	/**
	 * @param Brizy_Admin_Symbols_Symbol $aSymbol
	 *
	 * @return Brizy_Admin_Symbols_Symbol
	 */
	public function saveSymbol( $aSymbol ) {
		if ( ! $aSymbol ) {
			throw new Exception( "Unable to save NULL symbol" );
		}
		$this->saveAllSymbols( [ $aSymbol ] );

		return $aSymbol;
	}

	public function saveAllSymbols( $symbols ) {
		global $wpdb;
		$wpdb->query( 'START TRANSACTION' );
		try {
			foreach ( (array) $symbols as $symbol ) {
				if ( $symbol instanceof Brizy_Admin_Symbols_Symbol ) {
					$arr = [
						'post_title'   => $symbol->getLabel(),
						'post_name'    => $symbol->getUid(),
						'post_type'    => Brizy_Admin_Symbols_Main::CP_SYMBOL,
						'post_status'  => 'publish',
						'post_content' => base64_encode( json_encode( $symbol->convertToFullOptionValue() ) ),
					];
					if ( $symbol->getId() ) {
						$arr['ID'] = $symbol->getId();
						$t         = wp_update_post( $arr );
					} else {
						$t = wp_insert_post( $arr );
					}
					if ( $t === 0 ) {
						throw new Exception( "Unable to save symbol " . $symbol->getLabel() );
					}
					$symbol->setId( $t );
				}
			}
			$wpdb->query( 'COMMIT' );
		} catch ( Exception $e ) {
			$wpdb->query( 'ROLLBACK' );
			throw $e;
		}
	}

	/**
	 * @param Brizy_Admin_Symbols_Symbol $symbol
	 *
	 * @return void
	 */
	public function validateSymbol( $symbol ) {
		if ( is_null( $symbol->getUid() ) || empty( $symbol->getUid() ) ) {
			throw new Exception( 'Please provide the symbol uid' );
		}
		if ( is_null( $symbol->getVersion() ) || empty( $symbol->getVersion() ) ) {
			throw new Exception( 'Please provide the symbol version' );
		}
		$currentSymbol = $this->getByUID( $symbol->getUid() );
		if ( $currentSymbol && ( $currentSymbol->getVersion() + 1 != $symbol->getVersion() ) ) {
			throw new Exception( 'Invalid symbol version. Please refresh and try again.' );
		}
		if ( is_null( $symbol->getLabel() ) || empty( $symbol->getLabel() ) ) {
			throw new Exception( 'Please provide the symbol label' );
		}
		if ( is_null( $symbol->getClassName() ) || empty( $symbol->getClassName() ) ) {
			throw new Exception( 'Please provide a valid class name' );
		}
		if ( is_null( $symbol->getComponentTarget() ) || empty( $symbol->getComponentTarget() ) ) {
			throw new Exception( 'Please provide the component target' );
		}
		if ( $symbol->getVersion() > 1 && ( is_null( $symbol->getModel() ) || empty( $symbol->getModel() ) ) ) {
			throw new Exception( 'Please provide the symbol model' );
		}
		if ( $symbol->getVersion() > 1 && ( is_null( $symbol->getCompiledStyles() ) || empty( $symbol->getCompiledStyles() ) ) ) {
			throw new Exception( 'Please provide the compiled styles' );
		}
	}

}
