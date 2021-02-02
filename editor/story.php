<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/18/19
 * Time: 12:20 PM
 */


class Brizy_Editor_Story extends Brizy_Editor_Post
{
    use Brizy_Editor_AutoSaveAware;

    /**
     * @var string
     */
    protected $meta;

    /**
     * @var string
     */
    protected $media;


    /**
     * @var self;
     */
    static protected $block_instance = null;

    public static function cleanClassCache()
    {
        self::$block_instance = array();
    }

    /**
     * @param $apost
     * @param null $uid
     *
     * @return Brizy_Editor_Story|Brizy_Editor_Post|mixed
     * @throws Exception
     */
    public static function get($apost, $uid = null)
    {

        $wp_post_id = $apost;

        if ($apost instanceof WP_Post) {
            $wp_post_id = $apost->ID;
        }

        if (isset(self::$block_instance[$wp_post_id])) {
            return self::$block_instance[$wp_post_id];
        }

        return self::$block_instance[$wp_post_id] = new self($wp_post_id, $uid);
    }

    /**
     * Brizy_Editor_Story constructor.
     *
     * @param $wp_post_id
     * @param null $uid
     *
     * @throws Brizy_Editor_Exceptions_NotFound
     * @throws Brizy_Editor_Exceptions_UnsupportedPostType
     */
    public function __construct($wp_post_id, $uid = null)
    {

        if ($uid) {
            $this->uid = $uid;
        }

        parent::__construct($wp_post_id);
    }

    /**
     * @return bool
     */
    public function uses_editor()
    {
        return true;
    }

    /**
     * This should always return true
     *
     * @param $val
     *
     * @return $this
     */
    public function set_uses_editor($val)
    {
	    parent::set_uses_editor(true);

        return $this;
    }

    public function save($autosave = 0)
    {

        parent::save($autosave);

        if ($autosave !== 1) {
            $this->savePost();
        }
    }


}
