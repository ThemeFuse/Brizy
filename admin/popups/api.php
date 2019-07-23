<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 7/18/18
 * Time: 10:48 AM
 */


class Brizy_Admin_Popups_Api extends Brizy_Admin_AbstractApi
{

    const nonce = 'brizy-api';

    const CREATE_POPUP_ACTION = 'brizy-create-popup';
    const UPDATE_POPUP_ACTION = 'brizy-update-popup';

    /**
     * @var Brizy_Admin_Rules_Manager
     */
    private $ruleManager;

    /**
     * @return Brizy_Admin_Blocks_Api
     */
    public static function _init()
    {
        static $instance;

        if (!$instance) {
            $instance = new self(new Brizy_Admin_Rules_Manager());
        }

        return $instance;
    }

    /**
     * Brizy_Admin_Blocks_Api constructor.
     *
     * @param Brizy_Admin_Rules_Manager $ruleManager
     */
    public function __construct($ruleManager)
    {
        $this->ruleManager = $ruleManager;

        parent::__construct();
    }

    protected function getRequestNonce()
    {
        return $this->param('hash');
    }

    protected function initializeApiActions()
    {
        //add_action( 'wp_ajax_' . self::GET_GLOBAL_BLOCKS_ACTION, array( $this, 'actionGetPopups' ) );
        add_action('wp_ajax_' . self::CREATE_POPUP_ACTION, array($this, 'actionCreatePopup'));
        add_action('wp_ajax_' . self::UPDATE_POPUP_ACTION, array($this, 'actionUpdatePopup'));
    }

//    public function actionGetPopups()
//    {
//        $this->verifyNonce(self::nonce);
//
//        try {
//            $blocks = Brizy_Editor_Popups::getAllPopups();
//
//            $this->success($blocks);
//
//        } catch (Exception $exception) {
//            $this->error(400, $exception->getMessage());
//        }
//    }

    public function actionCreatePopup()
    {
        $this->verifyNonce(self::nonce);

        if (!$this->param('uid')) {
            $this->error(400, 'Invalid uid');
        }

        if (!$this->param('data')) {
            $this->error(400, 'Invalid data');
        }

        try {
            $editorData = stripslashes($this->param('data'));

            $block = $this->createPopup($this->param('uid'), 'publish', Brizy_Admin_Popups_Main::CP_POPUP);
            $block->set_editor_data($editorData);
            $block->set_needs_compile(true);


            // rules
            $rulesData = stripslashes($this->param('rules'));
            $rules = $this->ruleManager->createRulesFromJson($rulesData, Brizy_Admin_Popups_Main::CP_POPUP, false);

            $this->ruleManager->addRules($block->get_wp_post()->ID, $rules);

            $block->save();

            do_action('brizy_global_data_updated');

            $this->success(Brizy_Editor_Popup::postData($block));

        } catch (Exception $exception) {
            $this->error(400, $exception->getMessage());
        }
    }

    public function actionUpdatePopup()
    {
        $this->verifyNonce(self::nonce);

        try {

            if (!$this->param('uid')) {
                $this->error('400', 'Invalid uid');
            }

            if (!$this->param('data')) {
                $this->error('400', 'Invalid data');
            }


            $block = $this->getBlock($this->param('uid'), Brizy_Admin_Popups_Main::CP_POPUP);
            /**
             * @var Brizy_Editor_Block $block ;
             */
            $block->set_editor_data(stripslashes($this->param('data')));

            // rules
            $rulesData = stripslashes($this->param('rules'));
            $rules = $this->ruleManager->createRulesFromJson($rulesData, Brizy_Admin_Popups_Main::CP_POPUP, false);
            $block->setRules($rules);

            if ((int)$this->param('is_autosave')) {
                $block->auto_save_post();
            } else {
                $block->save();
                do_action('brizy_global_data_updated');
            }

            $this->success(Brizy_Editor_Popup::postData($block));
        } catch
        (Exception $exception) {
            $this->error(400, $exception->getMessage());
        }
    }


    public function actionDeletePopup()
    {
        $this->verifyNonce(self::nonce);

        if (!$this->param('uid')) {
            $this->error('400', 'Invalid uid');
        }

        if ($this->deletePopup($this->param('uid'), Brizy_Admin_Popups_Main::CP_POPUP)) {
            do_action('brizy_global_data_updated');
            $this->success(null);
        }

        $this->error('404', 'Block not found');
    }


    /**
     * @param $uid
     * @param $postType
     *
     * @return string|null
     */
    private function getPopupIdByUidAndBlockType($uid, $postType)
    {
        global $wpdb;

        $prepare = $wpdb->prepare("SELECT ID FROM {$wpdb->posts} p 
								JOIN {$wpdb->postmeta} pm  ON 
								pm.post_id=p.ID and 
								meta_key='brizy_post_uid' and 
								meta_value='%s'   
								WHERE p.post_type IN ('%s')
								ORDER BY p.ID DESC
								LIMIT 1", array($uid, $postType));

        return $wpdb->get_var($prepare);
    }


    /**
     * @param $id
     * @param $postType
     *
     * @return Brizy_Editor_Block|null
     * @throws Brizy_Editor_Exceptions_NotFound
     */
    private function getBlock($id, $postType)
    {
        $postId = $this->getPopupIdByUidAndBlockType($id, $postType);

        return Brizy_Editor_Block::get($postId);
    }

    /**
     * @param $uid
     * @param $status
     * @param $type
     *
     * @return Brizy_Editor_Block|null
     * @throws Brizy_Editor_Exceptions_NotFound
     */
    private function createPopup($uid, $status, $type)
    {
        $name = md5(time());
        $post = wp_insert_post(array(
            'post_title' => $name,
            'post_name' => $name,
            'post_status' => $status,
            'post_type' => $type
        ));

        if ($post) {
            $brizyPost = Brizy_Editor_Block::get($post, $uid);
            $brizyPost->set_uses_editor(true);
            $brizyPost->set_needs_compile(true);

            return $brizyPost;
        }

        throw new Exception('Unable to create block');
    }

    /**
     * @param $postUid
     * @param $postType
     *
     * @return false|WP_Post|null
     */
    private function deletePopup($postUid, $postType)
    {

        $postId = $this->getPopupIdByUidAndBlockType($postUid, $postType);

        return wp_delete_post($postId);
    }
}