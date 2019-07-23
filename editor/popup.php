<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 1/18/19
 * Time: 12:20 PM
 */


class Brizy_Editor_Popup extends Brizy_Editor_Post
{


    static protected $popup_instance = null;

    /**
     * @param $apost
     *
     * @return Brizy_Editor_Popup|null
     * @throws Brizy_Editor_Exceptions_NotFound
     */
    public static function get($apost, $uid = null)
    {

        $wp_post_id = $apost;
        if ($apost instanceof WP_Post) {
            $wp_post_id = $apost->ID;
        }

        if (isset(self::$popup_instance[$wp_post_id])) {
            return self::$popup_instance[$wp_post_id];
        }

        return self::$popup_instance[$wp_post_id] = new self($wp_post_id, $uid);

    }

    public function __construct($wp_post_id, $uid = null)
    {

        self::checkIfPostTypeIsSupported($wp_post_id);
        $this->wp_post_id = (int)$wp_post_id;

        if ($this->wp_post_id) {
            $this->wp_post = get_post($this->wp_post_id);
        }

        // get the storage values
        $storage = $this->storage();
        $storage_post = $storage->get(self::BRIZY_POST, false);

        $this->loadStorageData($storage_post);

        if ($uid) {
            $this->uid = $uid;
            update_post_meta($this->get_parent_id(), 'brizy_post_uid', $this->uid);
        } else {
            $this->create_uid();
        }
    }


    public function auto_save_post()
    {
        try {
            $user_id = get_current_user_id();
            $post = $this->get_wp_post();
            $postParentId = $this->get_parent_id();
            $old_autosave = wp_get_post_autosave($postParentId, $user_id);
            $post_data = get_object_vars($post);
            $post_data['post_content'] .= "\n<!-- " . time() . "-->";
            $autosavePost = null;

            if ($old_autosave) {
                $autosavePost = self::get($old_autosave);
            }

            if ($old_autosave) {
                $new_autosave = _wp_post_revision_data($post_data, true);
                $new_autosave['ID'] = $old_autosave->ID;
                $new_autosave['post_author'] = $user_id;

                // If the new autosave has the same content as the post, delete the autosave.
                $autosave_is_different = false;

                foreach (array_intersect(array_keys($new_autosave), array_keys(_wp_post_revision_fields($post))) as $field) {
                    if (normalize_whitespace($new_autosave[$field]) != normalize_whitespace($post->$field)) {
                        $autosave_is_different = true;
                        break;
                    }
                }

                if (!$autosave_is_different) {
                    wp_delete_post_revision($old_autosave->ID);

                    return new WP_Error('rest_autosave_no_changes', __('There is nothing to save. The autosave and the post content are the same.'), array('status' => 400));
                }

                /**
                 * This filter is documented in wp-admin/post.php.
                 */
                do_action('wp_creating_autosave', $new_autosave);

                // wp_update_post expects escaped array.
                wp_update_post(wp_slash($new_autosave));

            } else {
                // Create the new autosave as a special post revision.
                $revId = _wp_put_post_revision($post_data, true);
                $autosavePost = self::get($revId);
            }

            $autosavePost = $this->populateAutoSavedData($autosavePost);
            $autosavePost->save();

        } catch (Exception $exception) {
            Brizy_Logger::instance()->exception($exception);

            return false;
        }
    }


    public function jsonSerialize()
    {
        $data = get_object_vars($this);
        $data['editor_data'] = base64_decode($data['editor_data']);

        $ruleManager = new Brizy_Admin_Rules_Manager();

        $data['rules'] = $ruleManager->getRules($this->get_id());

        unset($data['wp_post']);

        return $data;
    }

    public function loadStorageData($data)
    {
        parent::loadStorageData($data);

        if (isset($data['position'])) {
            $this->position = $data['position'];
        }
    }

    public function convertToOptionValue()
    {
        $data = parent::convertToOptionValue();

        $ruleManager = new Brizy_Admin_Rules_Manager();
        $data['rules'] = $ruleManager->getRules($this->get_id());

        return $data;
    }

    /**
     * @param $autosave
     *
     * @return Brizy_Editor_Popup
     */
    protected function populateAutoSavedData($autosave)
    {
        /**
         * @var Brizy_Editor_Popup $autosave ;
         */
        $autosave = parent::populateAutoSavedData($autosave);

        return $autosave;
    }

    /**
     * @param $type
     * @param array $arags
     *
     * @return array
     * @throws Brizy_Editor_Exceptions_NotFound
     */
    public static function getAllPopups($arags = array())
    {

        $filterArgs = array(
            'post_type' => Brizy_Admin_Popups_Main::CP_POPUP,
            'posts_per_page' => -1,
            'post_status' => 'any',
            'orderby' => 'ID',
            'order' => 'ASC',
        );
        $filterArgs = array_merge($filterArgs, $arags);

        $wpBlocks = get_posts($filterArgs);
        $blocks = array();

        foreach ($wpBlocks as $wpPost) {
            $blocks[] = self::postData(Brizy_Editor_Popup::get($wpPost));
        }

        return $blocks;
    }


    /**
     * @param Brizy_Editor_Popup $post
     *
     * @return array
     */
    public static function postData(Brizy_Editor_Popup $post)
    {

        $p_id = (int)$post->get_id();
        $ruleManager = new Brizy_Admin_Rules_Manager();
        $global = array(
            'uid' => $post->get_uid(),
            'status' => get_post_status($p_id),
            'data' => $post->get_editor_data(),
            'rules' => $ruleManager->getRules($p_id),
        );

        return $global;
    }


}