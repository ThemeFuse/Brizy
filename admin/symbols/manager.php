<?php

class Brizy_Admin_Symbols_Manager {
	const BRIZY_SYMBOLS_KEY = 'brizy-symbols';

	/**
	 * @param $jsonString
	 * @param string $postType
	 *
	 * @return Brizy_Admin_Symbols_Symbol
	 * @throws Exception
	 */
	public function createFromJson( $jsonString ) {
		$jsonObj = json_decode( $jsonString );

		return Brizy_Admin_Symbols_Symbol::createFromJsonObject( $jsonObj );
	}

	/**
	 * @return Brizy_Admin_Symbols_Symbol[]
	 */
	public function getList() {
		$symbolsEncoded = get_option( self::BRIZY_SYMBOLS_KEY, base64_encode( "[]" ) );
		$jsonSymbols    = json_decode( base64_decode( $symbolsEncoded ) );

		$symbols = [];
		foreach ( $jsonSymbols as $symbol ) {
			$symbols[] = Brizy_Admin_Symbols_Symbol::createFromJsonObject( $symbol );
		}

		return $symbols;
	}

	/**
	 * @return Brizy_Admin_Symbols_Symbol
	 */
	public function get( $uid ) {

		$symbols = $this->getList();

		foreach ( $symbols as $symbol ) {
			if ( $symbol->getUid() == $uid ) {
				return $symbol;
			}
		}

		return null;
	}


	/**
	 * @param Brizy_Admin_Symbols_Symbol $aSymbol
	 */
	public function deleteSymbol( $aSymbol ) {
		if ( ! $aSymbol ) {
			throw new Exception("Unable to delete NULL symbol");
		}

		$symbols = $this->getList();

		foreach ( $symbols as $i => $symbol ) {
			if ( $symbol->getUid() == $aSymbol->getUid() ) {
				unset( $symbols[ $i ] );
			}
		}

		$this->saveAllSymbols( $symbols );
	}

	/**
	 * @param Brizy_Admin_Symbols_Symbol $aSymbol
	 *
	 * @return Brizy_Admin_Symbols_Symbol
	 */
	public function saveSymbol( $aSymbol ) {
		if ( ! $aSymbol ) {
			throw new Exception("Unable to save NULL symbol");
		}
		$symbols = $this->getList();

		foreach ( $symbols as $i => $symbol ) {
			if ( $symbol->getUid() == $aSymbol->getUid() ) {
				$symbols[ $i ] = $aSymbol;
				$this->saveAllSymbols( $symbols );

				return;
			}
		}
		$symbols[] = $aSymbol;
		$this->saveAllSymbols( $symbols );
	}

	private function saveAllSymbols( $symbols ) {
		update_option( self::BRIZY_SYMBOLS_KEY, base64_encode( json_encode( $symbols ) ) );
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

		$currentSymbol = $this->get( $symbol->getUid() );

		if ( $currentSymbol && ( $currentSymbol->getVersion() + 1 != $symbol->getVersion() ) ) {
			throw new Exception( 'Invalid symbol version. Please refresh and try again.' );
		}

		if ( is_null( $symbol->getLabel() ) || empty( $symbol->getLabel() ) ) {
			throw new Exception( 'Please provide the symbol label' );
		}

		if ( is_null( $symbol->getData() ) || empty( $symbol->getData() ) ) {
			throw new Exception( 'Please provide the symbol data' );
		}

	}

}
