<?php

class Brizy_Admin_Rule extends Brizy_Admin_Serializable implements Brizy_Admin_RuleInterface {

	const TYPE_INCLUDE = 1;
	const TYPE_EXCLUDE = 2;

	const POSTS = 1;
	const TAXONOMY = 2;
	const ARCHIVE = 4;
	const TEMPLATE = 8;
	const BRIZY_TEMPLATE = 16;

	/**
	 * @var int
	 */
	private $id;

	/**
	 * @var int
	 */
	private $type;

	/**
	 * @var int
	 */
	private $appliedFor;

	/**
	 * @var string
	 */
	private $entityType;

	/**
	 * If null the rule will be applied on all entities
	 *
	 * @var int[]
	 */
	private $entityValues = array();

	/**
	 * This prop is not going to be serialized.
	 * Please do not serialize it.
	 *
	 * @var int
	 */
	private $templateId;

	/**
	 * @return array|mixed
	 */
	public function jsonSerialize() {
		return $this->convertToOptionValue();
	}

	/**
	 * Brizy_Admin_Rule constructor.
	 *
	 * @param int $id
	 * @param int $type
	 * @param int $applied_for
	 * @param int $entity_type
	 * @param array $entities
	 */
	public function __construct( $id, $type, $applied_for, $entity_type, $entities ) {

		if ( ! $id ) {
			$this->setId( $this->generateId( $type, $applied_for, $entity_type, $this->getEntitiesAsString() ) );
		} else {
			$this->setId( $id );
		}

		$this->setType( $type );
		$this->setAppliedFor( $applied_for );
		$this->setEntityType( $entity_type );
		$this->setEntityValues( array_filter( (array) $entities, array( $this, 'filter' ) ) );


	}

	function filter( $v ) {
		return ! empty( $v );
	}

	/**
	 * Return true if the rule matches for the given parameters
	 *
	 * @param $applyFor
	 * @param $entityType
	 * @param $entityValues
	 *
	 * @return bool
	 */
	public function isMatching( $applyFor, $entityType, $entityValues ) {

		$ruleValues = array_filter( array(
			$this->getAppliedFor(),
			$this->getEntityType(),
			$this->getEntityValues(),
		), function ( $v ) {
			return ! empty( $v );
		} );

		$checkValues = array(
			$applyFor,
			$entityType,
			$entityValues,
		);

		// exception for home page that has two behaviors.. as page and as a template
		$entity_values = $this->getEntityValues();

		if ( $applyFor == self::TEMPLATE &&
		     $entityType == 'front_page' &&
		     $this->getAppliedFor() == self::POSTS &&
		     $this->getEntityType() == 'page' &&
		     isset( $entity_values[0] ) &&
		     $entity_values[0] == get_option( 'page_on_front' ) ) {
			return true;
		}


		foreach ( $ruleValues as $i => $value ) {

			if ( is_array( $value ) ) {
				// this means that the rull accept any value
				if ( count( $ruleValues[ $i ] ) == 0 ) {
					break;
				}

				// check if the value is contained in this rule
				if ( count( array_diff( $checkValues[ $i ], $ruleValues[ $i ] ) ) != 0 ) {
					return false;
				}

			} else {

				if ( $ruleValues[ $i ] != $checkValues[ $i ] ) {
					return false;
				}
			}
		}

		return true;
	}

	/**
	 * @param Brizy_Admin_Rule $rule
	 *
	 * @return bool
	 */
	public function isEqual( $rule ) {
		return $this->getType() == $rule->getType() &&
		       $this->getAppliedFor() == $rule->getAppliedFor() &&
		       $this->getEntityType() == $rule->getEntityType() &&
		       ( count( $rule->getEntityValues() ) == count( $this->getEntityValues() ) && count( array_diff( $rule->getEntityValues(), $this->getEntityValues() ) ) == 0 );
	}

	/**
	 * @return int
	 */
	public function getId() {
		return $this->id;
	}

	/**
	 * @param int $id
	 *
	 * @return Brizy_Admin_Rule
	 */
	public function setId( $id ) {

		$this->id = $id;

		return $this;
	}

	/**
	 * @return int
	 */
	public function getType() {
		return (int) $this->type;
	}

	/**
	 * @param int $type
	 *
	 * @return Brizy_Admin_Rule
	 */
	public function setType( $type ) {
		$this->type = $type;

		return $this;
	}

	/**
	 * @return int
	 */
	public function getAppliedFor() {
		return $this->appliedFor;
	}

	/**
	 * @param int $appliedFor
	 *
	 * @return Brizy_Admin_Rule
	 */
	public function setAppliedFor( $appliedFor ) {
		$this->appliedFor = $appliedFor;

		return $this;
	}

	/**
	 * @return string
	 */
	public function getEntityType() {
		return $this->entityType;
	}

	/**
	 * @param string $entityType
	 *
	 * @return Brizy_Admin_Rule
	 */
	public function setEntityType( $entityType ) {
		$this->entityType = $entityType;

		return $this;
	}

	/**
	 * @return string[]
	 */
	public function getEntityValues() {
		return is_null( $this->entityValues ) ? array() : array_map( function ( $id ) {
			return (int) $id;
		}, $this->entityValues );
	}

	/**
	 * @param int[] $entityValues
	 *
	 * @return Brizy_Admin_Rule
	 */
	public function setEntityValues( $entityValues ) {

		if ( ! is_array( $entityValues ) ) {
			throw new InvalidArgumentException();
		}

		$this->entityValues = $entityValues;

		return $this;
	}

	/**
	 * @return array
	 */
	public function convertToOptionValue() {
		return array(
			'id'           => $this->getId(),
			'type'         => $this->getType(),
			'appliedFor'   => $this->getAppliedFor(),
			'entityType'   => $this->getEntityType(),
			'entityValues' => $this->getEntityValues(),
		);
	}


	public function getRuleWeight() {

		$weight = 0;

		if ( $this->getAppliedFor() == self::TEMPLATE && $this->getEntityType() == 'front_page' ) {
			$weight = 20;
		}
		if ( $this->getAppliedFor() == self::TEMPLATE ) {
			$weight = 10;
		}

		$values = array();

		if ( $this->getType() ) {
			$values[] = $this->getType();
		}
		if ( $this->getAppliedFor() ) {
			$values[] = $this->getAppliedFor();
		}
		if ( $this->getEntityType() ) {
			$values[] = $this->getEntityType();
		}
		if ( count( $this->getEntityValues() ) > 0 ) {
			$values[] = $this->getEntityType();
		}

		$weight += count( $values );

		if ( $this->getType() == self::TYPE_EXCLUDE ) {
			$weight += 10;
		}

		return $weight;
	}

	/**
	 * @param $data
	 *
	 * @return Brizy_Admin_Rule|void
	 */
	static public function createFromSerializedData( $data ) {

		if ( is_null( $data ) ) {
			throw new Exception( 'Invalid parameter provided' );
		}

		return new self(
			isset( $data['id'] ) ? $data['id'] : null,
			isset( $data['type'] ) ? $data['type'] : null,
			isset( $data['appliedFor'] ) ? $data['appliedFor'] : null,
			isset( $data['entityType'] ) ? $data['entityType'] : null,
			isset( $data['entityValues'] ) ? $data['entityValues'] : null
		);
	}

	/**
	 * @param $data
	 *
	 * @return Brizy_Admin_Rule|void
	 */
	static public function createFromRequestData( $data ) {

		if ( is_null( $data ) || ! $data ) {
			throw new Exception( 'Invalid parameter provided' );
		}

		return new self(
			isset( $data['id'] ) ? $data['id'] : null,
			isset( $data['type'] ) ? $data['type'] : null,
			isset( $data['appliedFor'] ) ? $data['appliedFor'] : null,
			isset( $data['entityType'] ) ? $data['entityType'] : null,
			isset( $data['entityValues'] ) ? $data['entityValues'] : null
		);
	}

	static public function createFromJsonObject( $json ) {

		if ( is_null( $json ) ) {
			throw new Exception( 'Invalid parameter provided' );
		}

		return new self(
			isset( $json->id ) ? $json->id : null,
			isset( $json->type ) ? $json->type : null,
			isset( $json->appliedFor ) ? $json->appliedFor : null,
			isset( $json->entityType ) ? $json->entityType : null,
			isset( $json->entityValues ) ? $json->entityValues : null
		);
	}


	/**
	 * @param string $delimited
	 *
	 * @return string
	 */
	public function getEntitiesAsString( $delimited = ',' ) {
		return implode( $delimited, $this->getEntityValues() );
	}

	/**
	 * @return string
	 */
	private function generateId() {
		return md5( implode( '', func_get_args() ) );
	}

	/**
	 * @return int
	 */
	public function getTemplateId() {
		return $this->templateId;
	}

	/**
	 * @param int $templateId
	 *
	 * @return Brizy_Admin_Rule
	 */
	public function setTemplateId( $templateId ) {
		$this->templateId = $templateId;

		return $this;
	}
}