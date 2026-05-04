<?php

class Brizy_Admin_Symbols_Manager
{
    const BRIZY_SYMBOLS_KEY = 'brizy-symbols';

    /**
     * @var Brizy_Admin_Symbols_Symbol[]
     */
    private $cache = [];

    public function getByUID($uid)
    {
        if (isset($this->cache[$uid])) {
            return $this->cache[$uid];
        }

        global $wpdb;
        $row = $wpdb->get_row($wpdb->prepare("SELECT ID,post_content FROM $wpdb->posts WHERE post_type=%s and  post_title=%s", Brizy_Admin_Symbols_Main::CP_SYMBOL, $uid));
        if ($row) {
            $jsonObj = json_decode(base64_decode($row->post_content));
            $symbol = Brizy_Admin_Symbols_Symbol::createFromJsonObject($jsonObj, $row->ID);
            $this->cache[$uid] = $symbol;

            return $symbol;
        }

        return null;
    }

    /**
     * @param array $uids
     *
     * @return Brizy_Admin_Symbols_Symbol[]
     */
    public function getByUIDs(array $uids)
    {
        $result = [];
        $missing = [];

        foreach ($uids as $uid) {
            if (isset($this->cache[$uid])) {
                $result[$uid] = $this->cache[$uid];
            } else {
                $missing[] = $uid;
            }
        }

        if (!empty($missing)) {
            global $wpdb;
            $placeholders = implode(',', array_fill(0, count($missing), '%s'));
            $params = array_merge([Brizy_Admin_Symbols_Main::CP_SYMBOL], $missing);
            $rows = $wpdb->get_results($wpdb->prepare(
                "SELECT ID, post_content, post_excerpt FROM $wpdb->posts WHERE post_type=%s AND post_excerpt IN ($placeholders)",
                $params
            ));
            foreach ($rows as $row) {
                $jsonObj = json_decode(base64_decode($row->post_content));
                if ($jsonObj) {
                    $symbol = Brizy_Admin_Symbols_Symbol::createFromJsonObject($jsonObj, $row->ID);
                    $this->cache[$row->post_excerpt] = $symbol;
                    $result[$row->post_excerpt] = $symbol;
                }
            }
        }

        return $result;
    }

    /**
     * @param $jsonString
     *
     * @return Brizy_Admin_Symbols_Symbol[]
     * @throws Exception
     */
    public function createFromJson($jsonString)
    {
        $jsonObj = json_decode($jsonString);
        $result = [];

        $objects = is_array($jsonObj) ? $jsonObj : (!is_null($jsonObj) ? [$jsonObj] : []);

        // Batch-fetch existing symbols
        $uids = array_filter(array_map(function ($obj) {
            return $obj->uid ?? null;
        }, $objects));
        $existing = !empty($uids) ? $this->getByUIDs($uids) : [];

        foreach ($objects as $obj) {
            if (!is_null($obj)) {
                $dbOne = $existing[$obj->uid] ?? null;
                $result[] = Brizy_Admin_Symbols_Symbol::createFromJsonObject($obj, $dbOne ? $dbOne->getId() : null);
            }
        }

        return $result;
    }

    /**
     * @return Brizy_Admin_Symbols_Symbol[]
     */
    public function getList()
    {
        global $wpdb;
        $rows = $wpdb->get_results($wpdb->prepare("SELECT ID,post_content,post_excerpt FROM $wpdb->posts WHERE post_type=%s", Brizy_Admin_Symbols_Main::CP_SYMBOL));
        $symbols = [];
        foreach ($rows as $symbolRow) {
            $symbolJsonObj = json_decode(base64_decode($symbolRow->post_content));
            if ($symbolJsonObj) {
                $symbol = Brizy_Admin_Symbols_Symbol::createFromJsonObject($symbolJsonObj, $symbolRow->ID);
                $this->cache[$symbolRow->post_excerpt] = $symbol;
                $symbols[] = $symbol;
            } else {
                Brizy_Logger::instance()->error('Failed to decode symbol with ID ' . $symbolRow->ID);
            }
        }

        return $symbols;
    }

    /**
     * @param array $uids
     *
     * @return Brizy_Admin_Symbols_Symbol[]
     */
    public function getFiltered(array $uids)
    {
        if (empty($uids)) {
            return [];
        }

        return array_values($this->getByUIDs($uids));
    }


    /**
     * @param string $uid
     *
     * @throws Exception
     */
    public function deleteSymbol($uid)
    {
        if ($symbol = $this->getByUID($uid)) {
            wp_delete_post((int)$symbol->getId(), true);
            unset($this->cache[$uid]);
        } else {
            throw new Exception("Unable to find symbol with uid: " . $uid);
        }
    }

    /**
     * @param Brizy_Admin_Symbols_Symbol $aSymbol
     *
     * @return Brizy_Admin_Symbols_Symbol
     */
    public function saveSymbol($aSymbol)
    {
        if (!$aSymbol) {
            throw new Exception("Unable to save NULL symbol");
        }
        $this->saveAllSymbols([$aSymbol]);

        return $aSymbol;
    }

    public function saveAllSymbols($symbols)
    {
        global $wpdb;
        $wpdb->query('START TRANSACTION');
        try {
            foreach ((array)$symbols as $symbol) {
                if ($symbol instanceof Brizy_Admin_Symbols_Symbol) {
                    $arr = [
                        'post_title' => $symbol->getLabel(),
                        'post_excerpt' => $symbol->getUid(),
                        'post_type' => Brizy_Admin_Symbols_Main::CP_SYMBOL,
                        'post_status' => 'publish',
                        'post_content' => base64_encode(json_encode($symbol->convertToSaveValue())),
                    ];
                    if ($symbol->getId()) {
                        $arr['ID'] = $symbol->getId();
                        $t = wp_update_post($arr);
                    } else {
                        $t = wp_insert_post($arr);
                    }
                    if (is_wp_error($t)) {
                        throw new Exception("Unable to save symbol " . $symbol->getLabel());
                    }
                    $symbol->setId($t);
                    $this->cache[$symbol->getUid()] = $symbol;
                }
            }
            $wpdb->query('COMMIT');
        } catch (Exception $e) {
            $wpdb->query('ROLLBACK');
            throw $e;
        }
    }

    /**
     * @param Brizy_Admin_Symbols_Symbol $symbol
     * @param Brizy_Admin_Symbols_Symbol|null $currentSymbol Pre-fetched current symbol to avoid re-query
     *
     * @return void
     */
    public function validateSymbol($symbol, $currentSymbol = null)
    {
        if (is_null($symbol->getUid()) || empty($symbol->getUid())) {
            throw new Exception('Please provide the symbol uid');
        }
        if (is_null($symbol->getVersion()) || empty($symbol->getVersion())) {
            throw new Exception('Please provide the symbol version');
        }
        if (is_null($currentSymbol)) {
            $currentSymbol = $this->getByUID($symbol->getUid());
        }
        if ($currentSymbol && ($currentSymbol->getVersion() + 1 != $symbol->getVersion())) {
            throw new Exception('Invalid symbol version. Please refresh and try again.');
        }
        if (is_null($symbol->getLabel()) || empty($symbol->getLabel())) {
            throw new Exception('Please provide the symbol label');
        }
        if (is_null($symbol->getClassName()) || empty($symbol->getClassName())) {
            throw new Exception('Please provide a valid class name');
        }
        if (is_null($symbol->getComponentTarget()) || empty($symbol->getComponentTarget())) {
            throw new Exception('Please provide the component target');
        }
        if ($symbol->getVersion() > 1 && (is_null($symbol->getModel()) || empty($symbol->getModel()))) {
            throw new Exception('Please provide the symbol model');
        }
        if ($symbol->getVersion() > 1 && (is_null($symbol->getCompiledStyles()) || empty($symbol->getCompiledStyles()))) {
            throw new Exception('Please provide the compiled styles');
        }
    }

}
