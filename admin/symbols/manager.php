<?php

class Brizy_Admin_Symbols_Manager
{

    /**
     * @param $jsonString
     * @param string $postType
     *
     * @return Brizy_Admin_Symbols_Symbol
     * @throws Exception
     */
    public function createFromJson($jsonString)
    {
        $jsonObj = json_decode($jsonString);

        return Brizy_Admin_Symbols_Symbol::createFromJsonObject($jsonObj);
    }

    /**
     * @param $jsonString
     * @param string $postType
     *
     * @return array
     * @throws Exception
     */
    public function createSymbolsFromJson($jsonString, $postType = Brizy_Admin_Templates::CP_TEMPLATE)
    {
        $rulesJson = json_decode($jsonString);
        $rules     = array();

        if (is_array($rulesJson)) {
            foreach ($rulesJson as $ruleJson) {
                $rules[] = Brizy_Admin_Symbols_Symbol::createFromJsonObject($ruleJson);
            }
        }

        return $rules;
    }

    /**
     * @return Brizy_Admin_Symbols_Symbol[]
     */
    public function getList()
    {

        return [];
    }

    /**
     * @return Brizy_Admin_Symbols_Symbol
     */
    public function get($uid)
    {

        return new Brizy_Admin_Symbols_Symbol;
    }

    /**
     * @param $symbol
     *
     * @return void
     */
    public function addSymbol($symbol)
    {

    }

    /**
     * @param $symbol
     *
     * @return void
     */
    public function deleteSymbol($symbol)
    {

    }

    /**
     * @return Brizy_Admin_Symbols_Symbol
     */
    public function saveSymbol($symbol)
    {

    }

    /**
     * @param Brizy_Admin_Symbols_Symbol $symbol
     *
     * @return void
     */
    public function validateSymbol($symbol)
    {
        if (is_null($symbol->getUid()) || empty($symbol->getUid())) {
            throw new Exception('Please provide the symbol uid');
        }

        if (is_null($symbol->getVersion()) || empty($symbol->getVersion())) {
            throw new Exception('Please provide the symbol version');
        }

        $currentSymbol = $this->get($symbol->getUid());

        if ($currentSymbol && ($currentSymbol->getVersion() + 1 != $symbol->getVersion())) {
            throw new Exception('Invalid symbol version. Please refresh and try again.');
        }

        if ( is_null($symbol->getLabel()) || empty($symbol->getLabel())) {
            throw new Exception('Please provide the symbol label');
        }

        if ( is_null($symbol->getData()) || empty($symbol->getData())) {
            throw new Exception('Please provide the symbol data');
        }

    }

}
