<?php


class Brizy_Editor_Accounts_AbstractAccountManager {

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Editor_Accounts_Account[]
	 */
	private $accounts;

	/**
	 * Brizy_Editor_Accounts_AbstractAccountManager constructor.
	 *
	 * @param $class
	 * @param Brizy_Editor_Project $project
	 */
	public function __construct( $class, Brizy_Editor_Project $project ) {
		$this->project = $project;
		try {
			$this->loadAccounts( $class, $project );
		} catch ( Exception $exception ) {
			$this->accounts = array();
		}
	}

	public function getAllAccounts() {
		return $this->accounts;
	}

	/**
	 * @param $service
	 * @param $accountId
	 *
	 * @return Brizy_Editor_Accounts_Account[]|null
	 */
	public function getAccounts( $service ) {

		if ( isset( $this->accounts[ $service ] ) ) {
			return array_values( $this->accounts[ $service ] );
		}

		return array();
	}

	/**
	 * @param $service
	 * @param $accountId
	 *
	 * @return Brizy_Editor_Accounts_Account|null
	 */
	public function getAccount( $service, $accountId ) {
		return $this->accounts[ $service ][ $accountId ];
	}

	/**
	 * @param $service
	 * @param Brizy_Editor_Accounts_Account $anAccount
	 *
	 * @return bool
	 */
	public function hasAccount( $service, Brizy_Editor_Accounts_Account $anAccount ) {
		foreach ( $this->getAccounts( $service ) as $account ) {
			if ( $anAccount->isEqual( $account ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @param $service
	 * @param Brizy_Editor_Accounts_Account $account
	 */
	public function addAccount( $service, Brizy_Editor_Accounts_Account $account ) {

		if ( $this->hasAccount( $service, $account ) ) {
			return;
		}

		$this->accounts[ $service ][ $account->getId() ] = $account;


		$this->updateStorage();
	}

	/**
	 * @param $service
	 * @param Brizy_Editor_Accounts_Account $account
	 */
	public function deleteAccount( $service, Brizy_Editor_Accounts_Account $account ) {

		unset( $this->accounts[ $service ][ $account->getId() ] );

		$this->updateStorage();
	}

	/**
	 * @param $service
	 * @param $accountId
	 */
	public function deleteAccountById( $service, $accountId ) {

		unset( $this->accounts[ $service ][ $accountId ] );

		$this->updateStorage();
	}

	/**
	 *
	 */
	private function updateStorage() {

		$data = array();

		foreach ( $this->accounts as $service => $accounts ) {
			foreach ( $accounts as $account ) {
				$data[ $service ][] = $account->convertToOptionValue();
			}
		}

		$this->project->setAccounts( $data );
		$this->project->saveStorage();
	}

	/**
	 * @param $class
	 * @param Brizy_Editor_Project $project
	 *
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	private function loadAccounts( $class, Brizy_Editor_Project $project ) {

		//$this->project->setMetaValue( 'accounts', [] );
		$meta_value = $project->getMetaValue( 'accounts' );

		if ( is_array( $meta_value ) ) {
			foreach ( $meta_value as $service => $accounts ) {
				foreach ( $accounts as $account ) {
					$account1 = Brizy_Editor_Accounts_Account::createFromSerializedData( $account );


					if ( $this->hasAccount( $service, $account1 ) ) {
						continue;
					}

					$this->accounts[ $service ][ $account1->getId() ] = $account1;
				}
			}
		}
	}
}