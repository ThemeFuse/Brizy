<?php

abstract class Brizy_Admin_Serializable extends \BrizyPlaceholders\AbstractPlaceholder
{

    /**
     * @return mixed
     */
    abstract public function convertToOptionValue();

    /**
     * @param $data
     *
     * @throws Exception
     */
    static public function createFromSerializedData($data)
    {
        throw new Exception('Not implemented');
    }


}