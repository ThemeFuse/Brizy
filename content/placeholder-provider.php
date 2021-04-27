<?php

use BrizyPlaceholders\PlaceholderInterface;
use BrizyPlaceholders\RegistryInterface;

class Brizy_Content_PlaceholderProvider implements RegistryInterface
{

    /**
     * @var array of implements Brizy_Editor_Content_PlaceholdersProviderInterface
     */
    private $providers = array();

    /**
     * @var array
     */
    static private $cache_grouped_placeholders = null;
    static private $cache_all_placeholders = null;

    /**
     * BrizyPro_Content_ProviderPlaceholders constructor.
     *
     * $context: for back compatibility
     *
     * @param Brizy_Content_Context $context
     */
    public function __construct($context = null)
    {
        $this->providers[] = new Brizy_Content_Providers_FreeProvider();
        $this->providers = apply_filters('brizy_providers', $this->providers, null);
    }

    /**
     * @return array
     */
    public function getGroupedPlaceholders()
    {

        if (self::$cache_grouped_placeholders) {
            return self::$cache_grouped_placeholders;
        }

        $placeholders = array();
        $keys = array();

        foreach ($this->providers as $provider) {

            foreach ($provider->getGroupedPlaceholders() as $provider_group => $provider_placeholders) {
                /*$placeholders[ $provider_name ] = $provider_placeholders; - better way; to clean wp provider*/

                if (!isset($placeholders[$provider_group]))
                    $placeholders[$provider_group] = array();

                $placeholders[$provider_group] = array_merge($placeholders[$provider_group], $provider_placeholders);
            }
        }

        return apply_filters('brizy_placeholders', self::$cache_grouped_placeholders = $placeholders);
    }

    /**
     * @return array
     */
    public function getAllPlaceholders()
    {
        $out = array();

        if (self::$cache_all_placeholders) {
            return self::$cache_all_placeholders;
        }

        foreach ($this->providers as $provider) {
            $out = array_merge($out, $provider->getAllPlaceholders());
        }

        self::$cache_all_placeholders = $out;

        return $out;
    }

    public function getGroupedPlaceholdersForApiResponse()
    {
        $groups = $this->getGroupedPlaceholders();
        $result = [];
        foreach ($groups as $group => $entries) {

            $result[$group] = array_map(function ($entry) {
                unset($entry['instance']);
                $entry['placeholder'] = "{{{$entry['placeholder']}}}";
                return $entry;
            }, $entries);
        }

        return $result;
    }

    /**
     * @param $name
     * @return \BrizyPlaceholders\PlaceholderInterface
     */
    public function getPlaceholder($name)
    {
        return $this->getPlaceholderSupportingName($name);
    }

    /**
     * @inheritDoc
     */
    public function getPlaceholdersByGroup($groupName)
    {
        $getGroupedPlaceholders = $this->getGroupedPlaceholders();

        if (isset($getGroupedPlaceholders[$groupName])) {
            return $getGroupedPlaceholders[$groupName];
        }
    }

    /**
     * @inheritDoc
     */
    public function getPlaceholderSupportingName($name)
    {
        foreach ($this->getAllPlaceholders() as $placeholder) {
            if ($placeholder['instance']->support($name)) {
                return $placeholder['instance'];
            }
        }
    }

    public function registerPlaceholder(PlaceholderInterface $instance, $label, $placeholderName, $groupName)
    {
        throw new Exception('Try to use a specific registry to register the placeholder');
    }
}
