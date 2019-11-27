<?php


class Brizy_Editor_Accounts_ServiceAccountManager {

	/**
	 * @var Brizy_Editor_Project
	 */
	private $project;

	/**
	 * @var Brizy_Editor_Accounts_Account[]
	 */
	private $accounts;

	/**
	 * Brizy_Editor_Forms_Manager constructor.
	 *
	 * @param Brizy_Editor_Project $project
	 */
	public function __construct( Brizy_Editor_Project $project ) {
		$this->accounts = array();
		$this->project  = $project;
		try {
			$this->loadAccounts( $project );
		} catch ( Exception $exception ) {
			$this->accounts = array();
		}
	}

	public function getAllAccounts() {
		return $this->accounts;
	}

	public function getFilteredAccounts( $filter ) {
		$accounts = array();
		foreach ( $this->getAllAccounts() as $account ) {

			if ( isset( $filter['service'] ) && $filter['service'] != $account->getService() ) {
				continue;
			}

			if ( isset( $filter['group'] ) && $filter['group'] != $account->getGroup() ) {
				continue;
			}

			$accounts[] = $account;
		}

		return $accounts;
	}

	/**
	 * @param $group
	 *
	 * @return array
	 */
	public function getAccountsByGroup( $group ) {
		return $this->getFilteredAccounts( array( 'group' => $group ) );
	}

	/**
	 * @param $service
	 *
	 * @return array
	 */
	public function getAccountsByService( $service ) {
		return $this->getFilteredAccounts( array( 'service' => $service ) );
	}

	/**
	 * @param $accountId
	 *
	 * @return Brizy_Editor_Accounts_Account|mixed
	 */
	public function getAccount( $accountId ) {
		foreach ( $this->accounts as $key => $account ) {
			if ( $account->getId() == $accountId ) {
				return $account;
			}
		}
	}

	/**
	 * @param Brizy_Editor_Accounts_AbstractAccount $anAccount
	 *
	 * @return bool
	 */
	public function hasAccount( Brizy_Editor_Accounts_AbstractAccount $anAccount ) {
		foreach ( $this->getAllAccounts() as $account ) {
			if ( $anAccount->isEqual( $account ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * @param Brizy_Editor_Accounts_AbstractAccount $account
	 */
	public function addAccount( Brizy_Editor_Accounts_AbstractAccount $account ) {

		if ( $this->hasAccount( $account ) ) {
			return;
		}

		$this->accounts[] = $account;
		$this->updateStorage();
	}

	/**
	 * @param Brizy_Editor_Accounts_AbstractAccount $anAccount
	 */
	public function updateAccount( Brizy_Editor_Accounts_AbstractAccount $anAccount ) {

		foreach ( $this->getAllAccounts() as $index => $account ) {
			if ( $account->getId() == $anAccount->getId() ) {
				$this->accounts[ $index ] = $anAccount;
				break;
			}
		}

		$this->updateStorage();
	}

	/**
	 * @param Brizy_Editor_Accounts_AbstractAccount $account
	 */
	public function deleteAccount( Brizy_Editor_Accounts_AbstractAccount $account ) {

		$this->deleteAccountById( $account->getId() );
	}

	/**
	 * @param $accountId
	 */
	public function deleteAccountById( $accountId ) {

		foreach ( $this->getAllAccounts() as $key => $account ) {
			if ( $account->getId() == $accountId ) {
				unset( $this->accounts[ $key ] );
				break;
			}
		}

		$this->accounts = array_values( $this->accounts );

		$this->updateStorage();
	}

	/**
	 *
	 */
	private function updateStorage() {

		$data = array();

		foreach ( $this->getAllAccounts() as $account ) {
			$data[] = $account->convertToOptionValue();
		}

		$this->project->setAccounts( $data );
		$this->project->saveStorage();
	}

	/**
	 * @param Brizy_Editor_Project $project
	 *
	 * @throws Brizy_Editor_Exceptions_NotFound
	 */
	private function loadAccounts( Brizy_Editor_Project $project ) {

		$meta_value = $project->getMetaValue( 'accounts' );

		if ( is_array( $meta_value ) ) {
			foreach ( $meta_value as $account ) {

				try {
					$anAccount = Brizy_Editor_Accounts_AbstractAccount::createFromSerializedData( $account );

					if ( $this->hasAccount( $anAccount ) ) {
						continue;
					}

					$this->accounts[] = $anAccount;

				} catch ( Exception $e ) {
					continue;
				}
			}
		}
	}
}