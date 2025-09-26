<?php

use BrizyPlaceholders\PlaceholderInterface;
use BrizyPlaceholders\RegistryInterface;

class Brizy_Content_PlaceholderProvider extends \BrizyPlaceholders\Registry implements RegistryInterface
{

    static private $instance = null;

    /**
     * @var array of implements Brizy_Editor_Content_PlaceholdersProviderInterface
     */
    protected $providers = array();

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
    private function __construct($context = null)
    {
        $this->providers[] = new Brizy_Content_Providers_FreeProvider();
        $this->providers = apply_filters('brizy_providers', $this->providers, null);
    }

    static public function getInstance($context = null)
    {
        if (self::$instance === null) {
            self::$instance = new self($context);
        }

        return self::$instance;
    }

    /**
     * @return array
     */
    public function getGroupedPlaceholders()
    {
        if (self::$cache_grouped_placeholders) {
            return self::$cache_grouped_placeholders;
        }

        $result = array();

        foreach ($this->providers as $provider) {

            foreach ($provider->getPlaceholders() as $placeholder) {

                if ($placeholder->getGroup()) {
                    $result[$placeholder->getGroup()][] = $placeholder;
                }
            }
        }

        return apply_filters('brizy_placeholders', self::$cache_grouped_placeholders = $result);
    }

    public function getGroupedPlaceholdersForApiResponse()
    {
        $groups = $this->getGroupedPlaceholders();
        $result = [];
        foreach ($groups as $group => $entries) {
            $result[$group] = array_map(function (PlaceholderInterface $entry) {
                return apply_filters('editor_placeholder_data', $entry->getConfigStructure(), $entry);
            }, $entries);
        }

        return $result;
    }

    /**
     * @inheritDoc
     */
    public function getPlaceholderSupportingName($name)
    {
        foreach ($this->providers as $provider) {
            if ($instance = $provider->getPlaceholderSupportingName($name)) {
                return $instance;
            }
        }
    }

    public function registerPlaceholder(PlaceholderInterface $instance)
    {
        throw new Exception('Try to use a specific registry to register the placeholder');
    }

    public function registerPlaceholderName(string $placeholderName, callable $factory)
    {
        throw new Exception('Try to use a specific registry to register the placeholder');
    }
}
