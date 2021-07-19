<?php

class Brizy_Admin_Rule extends Brizy_Admin_Serializable implements Brizy_Admin_RuleInterface {

	const TYPE_INCLUDE = 1;
	const TYPE_EXCLUDE = 2;

	const ALL = 0;
	const POSTS = 1;
	const TAXONOMY = 2;
	const ARCHIVE = 4;
	const TEMPLATE = 8; // author/search/home_page...
	const BRIZY_TEMPLATE = 16; // brizy template
	const ANY_CHILD_TAXONOMY = 128;
	const WOO_SHOP_PAGE = 256;
	const DATE_ARCHIVE = self::ARCHIVE | 512;
	const YEAR_ARCHIVE = self::DATE_ARCHIVE | 1024;
	const MONTH_ARCHIVE = self::DATE_ARCHIVE | 2048;
	const DAY_ARCHIVE = self::DATE_ARCHIVE | 4096;

	/**
	 * @var int
	 */
	protected $id;

	/**
	 * @var int
	 */
	protected $type;

	/**
	 * @var int
	 */
	protected $appliedFor;

	/**
	 * @var string
	 */
	protected $entityType;

	/**
	 * If null the rule will be applied on all entities
	 *
	 * @var int[]
	 */
	protected $entityValues = array();

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

		$ruleValues = array(
			$this->getType(),
			$this->getAppliedFor(),
			$this->getEntityType(),
			$this->getEntityValues(),
		);

		$checkValues = array(
			self::TYPE_INCLUDE, // include
			$applyFor,
			$entityType,
			$entityValues,
		);



		// return if the rule is for exclude
//		if($ruleValues[0]!=$checkValues[0]) {
//			return false;
//		}

		$entity_values = $this->getEntityValues();

		// check is the rule is matching all
		if($ruleValues[0]==self::TYPE_INCLUDE && !$ruleValues[1])
			return  true;

		// exception for home page that has two behaviors.. as page and as a template
		if ( $applyFor == self::TEMPLATE &&
		     $entityType == 'front_page' &&
		     $this->getAppliedFor() == self::POSTS &&
		     $this->getEntityType() == 'page' &&
		     isset( $entity_values[0] ) &&
		     $entity_values[0] == get_option( 'page_on_front' ) ) {
			return true;
		}

		// check post author
		if ( isset( $entity_values[0] ) && isset( $entityValues[0] ) && ( $values = explode( '|', $entity_values[0] ) ) && count( $values ) == 2 ) {
			if ( $values[0] === 'author' ) {
				return get_post_field( 'post_author', $entityValues[0] ) == $values[1];
			}
		}
		// check if post is in a term
		if ( isset( $entity_values[0] ) && ( $values = explode( '|', $entity_values[0] ) ) && count( $values ) == 3 ) {

			// POSTS
			if ( $applyFor == self::POSTS && $this->getAppliedFor() == self::POSTS && $values[0] === 'in' ) {
				// check if the post is in taxonomy with name $values[0] and with id $values[1]
				return has_term( $values[2], $values[1], $entityValues[0] );
			}

			// check if post is in a term
			if ( $applyFor == self::POSTS && $this->getAppliedFor() == self::POSTS && $values[0] === 'child' ) {
				// check if the post is in taxonomy with name $values[0] and with id $values[1]
				$tax = get_term_children( $values[2], $values[1] );

				foreach ( $tax as $t ) {
					if ( has_term( $t, $values[1], $entityValues[0] ) ) {
						return true;
					}
				}

				return false;
			}

			// TAXONOMY
			if ( $applyFor == self::TAXONOMY && $this->getAppliedFor() == self::TAXONOMY && $values[0] === 'in' ) {
				return $entityValues[0] == $values[2];
			}

			// check if terms is child of a term
			if ( $applyFor == self::TAXONOMY && $this->getAppliedFor() == self::TAXONOMY && $values[0] === 'child' ) {
				$tax = get_term_children( $values[2], $values[1] );

				return in_array( $entityValues[0], $tax );
			}
		}

		// matching archive rules
		if ( isset( $ruleValues[1] ) && isset( $checkValues[1] ) && ( $ruleValues[1] & self::ARCHIVE ) && ( $checkValues[1] & self::ARCHIVE ) ) {

			if ($checkValues[1] == $ruleValues[1] ||
                $ruleValues[1] == self::DATE_ARCHIVE ||
                $ruleValues[1] == self::YEAR_ARCHIVE ||
                $ruleValues[1] == self::MONTH_ARCHIVE ||
                $ruleValues[1] == self::DAY_ARCHIVE ||
                $ruleValues[1] == self::ARCHIVE) {
				if(empty($ruleValues[2]) || $ruleValues[2]==$entityType) {
				    return true;
                }
			}



		}

		foreach ( $ruleValues as $i => $value ) {

		    if($i===0) continue;

			if ( is_array( $value ) ) {
				// this means that the rule accept any value
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
		       ( count( $rule->getEntityValues() ) == count( $this->getEntityValues() ) &&
		         count( array_diff( $rule->getEntityValues(), $this->getEntityValues() ) ) == 0 );
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
		$this->type = (int) $type;

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
		if ( $val = (int) $appliedFor ) {
			$this->appliedFor = $val;
		}

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
		return $this->entityValues;
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

		$this->entityValues = array_values( $entityValues );

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


	public function getRuleWeight( $context ) {

		$weight = 0;

		if ( $this->getAppliedFor() == self::TEMPLATE && $this->getEntityType() == 'front_page' ) {
			$weight += 20;
		}
		if ( $this->getAppliedFor() == self::TEMPLATE ) {
			$weight += 10;
		}

		if ( $this->getEntityType() === 'product' ) {
			$weight += 30;
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

		if ( isset( $context['type'] ) && $this->getAppliedFor() === $context['type'] ) {
			$weight += 1;
		}

		if ( isset( $context['entityType'] ) && $this->getEntityType() === $context['entityType'] ) {
			$weight += 1;
		}

		if ( isset( $context['entityValues'] ) && $intersection = count(
				array_intersect( $context['entityValues'], $this->getEntityValues() )
			) ) {
			$weight += $intersection;
		}

		return $weight;
	}

	/**
	 * @param $data
	 *
	 * @return Brizy_Admin_Rule|void
	 * @throws Exception
	 */
	static public function createFromSerializedData( $data ) {

		if ( is_null( $data ) ) {
			throw new Exception( 'Invalid parameter provided' );
		}

		return new self(
			isset( $data['id'] ) ? $data['id'] : null,
			isset( $data['type'] ) && ! empty( $data['type'] ) ? $data['type'] : null,
			isset( $data['appliedFor'] ) && ! empty( $data['appliedFor'] ) ? $data['appliedFor'] : null,
			isset( $data['entityType'] ) ? $data['entityType'] : null,
			isset( $data['entityValues'] ) ? $data['entityValues'] : null
		);
	}

	/**
	 * @param $data
	 *
	 * @return Brizy_Admin_Rule
	 * @throws Exception
	 */
	static public function createFromRequestData( $data ) {

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
	 * @return string
	 */
	public function serialize() {
		return serialize( $this->convertToOptionValue() );
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
		return md5( implode( '', func_get_args() ) . rand( 1, time() ) );
	}
}
