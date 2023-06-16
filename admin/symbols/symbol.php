<?php

class Brizy_Admin_Symbols_Symbol extends Brizy_Admin_Serializable
{
    private $uid;

    private $label;

    private $version = 0;

    private $data;

    public function __construct($uid = null, $label = null, $data = null, $version = null)
    {
        $this->setUid($uid);
        $this->setLabel($label);
        $this->setData($data);
        $this->setVersion($version);
    }

    /**
     * @return mixed
     */
    public function getUid()
    {
        return $this->uid;
    }

    /**
     * @param mixed $uid
     */
    public function setUid($uid)
    {
        $this->uid = $uid;
    }

    /**
     * @return mixed
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @param mixed $label
     */
    public function setLabel($label)
    {
        $this->label = $label;
    }

    /**
     * @return int
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * @param int $version
     */
    public function setVersion($version)
    {
        $this->version = $version;
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * @param mixed $data
     */
    public function setData($data)
    {
        $this->data = $data;
    }

    /**
     * @param $data
     *
     * @return Brizy_Admin_Symbols_Symbol
     * @throws Exception
     */
    static public function createFromSerializedData($data)
    {

        if (is_null($data)) {
            throw new Exception('Invalid parameter provided');
        }

        return new self(
            isset($data['uid']) ? $data['uid'] : null,
            isset($data['label']) && ! empty($data['label']) ? $data['label'] : null,
            isset($data['data']) && ! empty($data['data']) ? $data['data'] : null,
            isset($data['version']) ? $data['version'] : null
        );
    }


    /**
     * @param $json
     *
     * @return Brizy_Admin_Symbols_Symbol
     * @throws Exception
     */
    static public function createFromJsonObject($json)
    {
        if (is_null($json)) {
            throw new Exception('Invalid parameter provided');
        }

        return new self(
            isset($json->uid) ? $json->uid : null,
            isset($json->label) ? $json->label : null,
            isset($json->data) ? $json->data : null,
            isset($json->version) ? $json->version : null
        );
    }


    /**
     * @param Brizy_Admin_Symbols_Symbol $patch
     *
     * @return void
     */
    public function patchFrom($patch)
    {
        if ( ! is_null($patch->getData()) && ! empty($patch->getData())) {
            $this->setData($patch->getData());
        }
        if ( ! is_null($patch->getLabel()) && ! empty($patch->getLabel())) {
            $this->setLabel($patch->getLabel());
        }
        if ( ! is_null($patch->getVersion()) && ! empty($patch->getVersion())) {
            $this->setVersion($patch->getVersion());
        }
    }

    public function incrementVersion() {
        $this->setVersion($this->getVersion()+1);
    }

    public function convertToOptionValue()
    {
        return array(
            'uid'     => $this->getUid(),
            'label'   => $this->getLabel(),
            'data'    => $this->getData(),
            'version' => $this->getVersion(),
        );
    }

	public function jsonSerialize() {
		return $this->convertToOptionValue();
	}
}
