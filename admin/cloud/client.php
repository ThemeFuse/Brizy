<?php


class Brizy_Admin_Cloud_Client extends WP_Http
{

    use Brizy_Editor_Asset_AttachmentAware;

    const TRANSIENT_KEY = 'brizy_cloud_editor_versions';

    /**
     * @var Brizy_Editor_Project
     */
    private $brizyProject;

    /**
     * @var WP_Http
     */
    private $http;

    /**
     * @var integer
     */
    private $library;

    /**
     * @var Brizy_Admin_Cloud_Client
     */
    static private $instance;

    /**
     * @param $project
     * @param $http
     *
     * @return Brizy_Admin_Cloud_Client
     */
    public static function instance($project, $http)
    {
        static $instance;
        if (self::$instance) {
            return self::$instance;
        }

        return self::$instance = new self($project, $http);
    }

    /**
     * Brizy_Admin_Cloud_Client constructor.
     *
     * @param Brizy_Editor_Project $project
     * @param WP_Http $http
     */
    private function __construct($project, $http)
    {
        $this->brizyProject = $project;
        $this->http = $http;

        add_action('brizy-updated', ['Brizy_Admin_Cloud_Client', 'clearVersionCache']);
        do_action('brizy-activated', ['Brizy_Admin_Cloud_Client', 'clearVersionCache']);
    }

    public static function clearVersionCache()
    {
        delete_transient(self::TRANSIENT_KEY);
    }

    /**
     * @return Brizy_Editor_Project
     */
    public function getBrizyProject()
    {
        return $this->brizyProject;
    }

    /**
     * @param Brizy_Editor_Project $brizyProject
     *
     * @return Brizy_Admin_Cloud_Client
     */
    public function setBrizyProject($brizyProject)
    {
        $this->brizyProject = $brizyProject;

        return $this;
    }

    /**
     * @return WP_Http
     */
    public function getHttp()
    {
        return $this->http;
    }

    /**
     * @param WP_Http $http
     *
     * @return Brizy_Admin_Cloud_Client
     */
    public function setHttp($http)
    {
        $this->http = $http;

        return $this;
    }

    /**
     * @param $uid
     *
     * @return string
     */
    public function getScreenshotUrl($uid)
    {
        $url = Brizy_Config::getEditorBaseUrls() . Brizy_Config::CLOUD_SCREENSHOT;

        return sprintf($url, $uid);
    }

    /**
     * @param $screenUid
     * @param $filePath
     *
     * @return bool
     */
    public function createScreenshot($screenUid, $filePath)
    {
        $data = array(
            'uid' => $screenUid,
            'attachment' => base64_encode(file_get_contents($filePath))
        );
        $response = $this->http->post(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SCREENSHOTS, array(
            'headers' => $this->getHeaders(),
            'body' => $data
        ));

        $code = wp_remote_retrieve_response_code($response);

        if ($code >= 200 && $code <= 300) {
            return true;
        }

        return false;
    }

    private function getHeaders($aditional = null)
    {

        $values = $this->getCloudEditorVersions();

        return array_merge(array(
            //'X-AUTH-APP-TOKEN'  => Brizy_Config::CLOUD_APP_KEY,
            'X-AUTH-USER-TOKEN' => $this->brizyProject->getMetaValue('brizy-cloud-token'),
            'X-EDITOR-VERSION' => $values['editor'],
            'X-SYNC-VERSION' => BRIZY_SYNC_VERSION
        ), is_array($aditional) ? $aditional : array());
    }

    private function getHeadersWithoutAuthorization($aditional = null)
    {
        return array_merge(array(
            //'X-AUTH-APP-TOKEN'  => Brizy_Config::CLOUD_APP_KEY,
            'X-SYNC-VERSION' => BRIZY_SYNC_VERSION
        ), is_array($aditional) ? $aditional : array());
    }

    public function getLibraries()
    {
        $response = $this->http->get(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LIBRARY, array('headers' => $this->getHeaders()));

        $code = wp_remote_retrieve_response_code($response);

        if ($code == 200) {

            $body = wp_remote_retrieve_body($response);

            $libraries = json_decode($body);

            if (count($libraries) == 0) {
                throw new Exception('No libraries provided');
            }


            return $libraries;
        }

        return null;
    }

    /**
     * @param $email
     * @param $password
     *
     * @return array|bool|WP_Error
     */
    public function signIn($email, $password)
    {

        $response = $this->http->post(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SIGNIN, array(
            'headers' => $this->getHeadersWithoutAuthorization(array(
                'Content-type' => 'application/x-www-form-urlencoded'
            )),
            'body' => array(
                'email' => $email,
                'password' => $password
            ),
            'timeout' => 30
        ));

        $code = wp_remote_retrieve_response_code($response);

        if ($code == 200) {

            $jsonResponse = json_decode($response['body']);

            // update cloud editor versions
            $this->getCloudEditorVersions(true);

            return $jsonResponse->token;
        }

        return false;
    }


    /**
     * @param string $firstName
     * @param string $lastName
     * @param string $email
     * @param string $password
     * @param string $confirmPassword
     *
     * @return bool
     */
    public function signUp($firstName, $lastName, $email, $password, $confirmPassword)
    {

        $response = $this->http->post(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SIGNUP, array(
            'headers' => $this->getHeadersWithoutAuthorization(array(
                'Content-type' => 'application/x-www-form-urlencoded'
            )),
            'body' => array(
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $email,
                'new_password' => $password,
                'confirm_password' => $confirmPassword,
            )
        ));

        $code = wp_remote_retrieve_response_code($response);

        if ($code == 200) {

            $jsonResponse = json_decode($response['body']);

            return $jsonResponse->token;
        }

        return false;
    }

    /**
     * @param $email
     *
     * @return bool
     */
    public function resetPassword($email)
    {

        $response = $this->http->post(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_RESET_PASSWORD, array(
            'headers' => $this->getHeaders(array(
                'Content-type' => 'application/x-www-form-urlencoded'
            )),
            'body' => array(
                'email' => $email,
            )
        ));

        $code = wp_remote_retrieve_response_code($response);

        return $code >= 200 && $code < 300;
    }

    public function getCloudEditorVersions($ignoreCache = false)
    {

        $value = get_transient('brizy_cloud_editor_versions');

        if ($value && !$ignoreCache) {
            return $value;
        }

        $url = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_EDITOR_VERSIONS;

        $response = $this->http->get($url);

        $code = wp_remote_retrieve_response_code($response);

        if ($code == 200) {
            $value = (array)json_decode($response['body']);
            set_transient('brizy_cloud_editor_versions', $value, 3600);
        } else {
            throw new Exception(wp_remote_retrieve_response_message($response));
        }

        return $value;
    }

    public function getContainers()
    {
        return $this->getCloudEntity(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_CONTAINERS, []);
    }

    public function getProjects($filters)
    {
        return $this->getCloudEntity(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_PROJECTS, $filters);
    }

    public function getProject($id)
    {

        $url = sprintf(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_PROJECTS . "/%d", (int)$id);
        $response = $this->http->get($url, array('headers' => $this->getHeaders()));

        $code = wp_remote_retrieve_response_code($response);
        if ($code == 200) {
            return json_decode($response['body']);
        }

        return null;
    }

    public function createProject($container, $name)
    {

        $response = $this->http->post(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_PROJECTS, array(
            'headers' => $this->getHeaders(),
            'body' => array(
                'name' => $name,
                'container' => $container,
                'globals' => null,
                'site_id' => null
            )
        ));

        $code = wp_remote_retrieve_response_code($response);
        if ($code == 200) {
            return json_decode($response['body']);
        }

        return false;
    }

    public function getBlocks($filters = array())
    {
        return $this->getCloudEntityByContainer(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS, $filters);
    }

    /**
     * @param $id
     *
     * @return array|mixed|object|null
     */
    public function getBlockByUid($uid)
    {
        $blocks = $this->getBlocks(['uid' => $uid]);

        return array_pop($blocks);
    }

    /**
     * @param $id
     *
     * @return array|mixed|object|null
     */
    public function getBlock($id)
    {
        $blocks = $this->getCloudEntityByContainer(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS . "/{$id}", []);

        return array_pop($blocks);
    }

    /**
     * @param Brizy_Editor_Block $block
     *
     * @return bool
     * @throws Exception
     */
    public function createOrUpdateBlock($block)
    {

        $cloudBlockData = array(
            'container' => $this->brizyProject->getCloudContainer(),
            'meta' => $block->getMeta(),
            'media' => $block->getMedia(),
            'data' => $block->get_editor_data(),
            'uid' => $block->getUid(),
            'dataVersion' => 1
        );

        $url = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS;
        $cloudUid = $block->getCloudId($this->brizyProject->getCloudAccountId());
        $cloudBlock = null;
        if (!$cloudUid && ($cloudBlock = $this->getBlockByUid($block->getUid()))) {
            $cloudUid = $cloudBlock->uid;
        }


        if (!$cloudUid) {
            $response = $this->http->post($url, array(
                'headers' => $this->getHeaders(),
                'body' => $cloudBlockData
            ));
        } else {

            $cloudBlockData['dataVersion'] = $cloudBlock->dataVersion + 1;

            $response = $this->http->request($url . "/" . $cloudBlock->id, array(
                'method' => 'PUT',
                'headers' => $this->getHeaders(),
                'body' => $cloudBlockData
            ));
        }

        $code = wp_remote_retrieve_response_code($response);

        if ($code >= 400) {
            // update cloud editor versions
            $this->getCloudEditorVersions(true);
            Brizy_Logger::instance()->critical('Cloud api exception', [$response]);
            throw new Exception(wp_remote_retrieve_response_message($response));
        }

        return json_decode(wp_remote_retrieve_body($response));
    }

    /**
     * @param $blockId
     *
     * @return bool
     * @throws Exception
     */
    public function deleteBlock($blockId)
    {
        $query = http_build_query(['container' => $this->brizyProject->getCloudContainer()]);
        $url = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_SAVEDBLOCKS . "/" . $blockId . "?" . $query;
        $response = $this->http->request($url, array('method' => 'DELETE', 'headers' => $this->getHeaders()));
        $code = wp_remote_retrieve_response_code($response);

        if ($code >= 400) {
            throw new Exception('Invalid code return by cloud api');
        }

        return $code == 200;
    }


    /**
     * @param $filters
     *
     * @return array|mixed|object|null
     */
    public function getPopups($filters = array())
    {
        return $this->getCloudEntity(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_POPUPS, $filters);
    }

    /**
     * @param $uid
     *
     * @return mixed
     */
    public function getPopupByUid($uid)
    {
        $popups = $this->getPopups(['uid' => $uid]);

        return array_pop($popups);
    }

    /**
     * @param Brizy_Editor_Popup $popup
     *
     * @return bool
     * @throws Exception
     */
    public function createOrUpdatePopup($popup)
    {

        $cloudBlockData = array(
            'container' => $this->brizyProject->getCloudContainer(),
            'meta' => $popup->getMeta(),
            'data' => $popup->get_editor_data(),
            'is_autosave' => 0,
            'uid' => $popup->getUid(),
            'dataVersion' => 1

        );

        $url = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_POPUPS;

        $cloudUid = $popup->getCloudId($this->brizyProject->getCloudAccountId());


        if ($cloudUid) {
            $response = $this->http->request($url, array(
                'method' => 'PUT',
                'headers' => $this->getHeaders(),
                'body' => $cloudBlockData
            ));
        } else {
            $response = $this->http->post($url . "/" . $cloudUid, array(
                'headers' => $this->getHeaders(),
                'body' => $cloudBlockData
            ));
        }

        $code = wp_remote_retrieve_response_code($response);

        if ($code >= 400) {
            $this->getCloudEditorVersions(true);
            Brizy_Logger::instance()->critical('Cloud api exception', [$response]);
            throw new Exception('Invalid code return by cloud api');
        }

        return json_decode(wp_remote_retrieve_body($response));
    }

    /**
     * @param $popupId
     *
     * @return bool
     * @throws Exception
     */
    public function deletePopup($popupId)
    {
        $query = http_build_query(['container' => $this->brizyProject->getCloudContainer()]);
        $url = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_POPUPS . "/" . $popupId . "?" . $query;
        $response = $this->http->request($url, array('method' => 'DELETE', 'headers' => $this->getHeaders()));
        $code = wp_remote_retrieve_response_code($response);

        if ($code >= 400) {
            throw new Exception('Invalid code return by cloud api');
        }

        return $code == 200;
    }


    /**
     * @param $filters
     *
     * @return array|mixed|object|null
     */
    public function getLayouts($filters = array())
    {
        return $this->getCloudEntity(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LAYOUTS, $filters);
    }

    /**
     * @param $uid
     *
     * @return mixed
     */
    public function getLayoutByUid($uid)
    {
        $layouts = $this->getLayouts(['uid' => $uid]);

        return array_pop($layouts);
    }

    /**
     * @param $id
     *
     * @return array|mixed|object|null
     */
    public function getLayout($id)
    {
        return $this->getCloudEntityByContainer(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LAYOUTS . "/" . $id, []);
    }


    /**
     * @param Brizy_Editor_Layout $layout
     *
     * @return bool
     * @throws Exception
     */
    public function createOrUpdateLayout($layout)
    {

        $cloudBlockData = array(
            'container' => $this->brizyProject->getCloudContainer(),
            'meta' => $layout->getMeta(),
            'media' => $layout->getMedia(),
            'data' => $layout->get_editor_data(),
            'uid' => $layout->getUid(),
            'dataVersion' => 1
        );

        $url = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LAYOUTS;


        $cloudUid = $layout->getCloudId($this->brizyProject->getCloudAccountId());

        $cloudLayout = null;
        if (!$cloudUid && ($cloudLayout = $this->getLayoutByUid($layout->getUid()))) {
            $cloudUid = $cloudLayout->uid;
        }

        if (!$cloudUid) {
            $response = $this->http->post($url, array(
                'headers' => $this->getHeaders(),
                'body' => $cloudBlockData
            ));
        } else {
            $cloudBlockData['dataVersion'] = $cloudLayout->dataVersion + 1;

            $response = $this->http->request($url . "/" . $cloudLayout->id, array(
                'method' => 'PUT',
                'headers' => $this->getHeaders(),
                'body' => $cloudBlockData,
            ));
        }

        $code = wp_remote_retrieve_response_code($response);

        if ($code >= 400) {
            $this->getCloudEditorVersions(true);
            Brizy_Logger::instance()->critical('Cloud api exception', [$response]);
            throw new Exception('Invalid code return by cloud api');
        }

        return json_decode(wp_remote_retrieve_body($response));
    }

    /**
     * @param $layoutId
     *
     * @return bool
     * @throws Exception
     */
    public function deleteLayout($layoutId)
    {
        $query = http_build_query(['container' => $this->brizyProject->getCloudContainer()]);
        $url = Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_LAYOUTS . "/" . $layoutId . "?" . $query;
        $response = $this->http->request($url, array('method' => 'DELETE', 'headers' => $this->getHeaders()));
        $code = wp_remote_retrieve_response_code($response);

        if ($code >= 400) {
            throw new Exception('Invalid code return by cloud api');
        }

        return $code == 200;
    }


    /**
     * @param $uid
     *
     * @return bool
     * @throws Exception
     */
    public function isMediaUploaded($uid)
    {
        $cloud_entity_by_container = $this->getCloudEntity(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_MEDIA, ['name' => $uid]);

        return is_array($cloud_entity_by_container) && count($cloud_entity_by_container) > 0;
    }

   /**
     * @param $uid
     *
     * @return bool
     * @throws Exception
     */
    public function isCustomFileUploaded($fileUid, $customFileName)
    {
        // download file and store it in wp
        $urlBuilder = new Brizy_Editor_UrlBuilder();
        $external_asset_url = $urlBuilder->external_custom_file($fileUid, $customFileName);

        $response = $this->http->get($external_asset_url);
        $code = wp_remote_retrieve_response_code($response);

        if($code>=500) {
            throw new \Exception('Unable to determine if the files was uploaded or not.');
        }

        return $code==200;
    }

    /**
     * @param $file
     *
     * @return bool
     * @throws Exception
     */
    public function uploadMedia($uid, $file)
    {

        $response = $this->http->post(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_MEDIA, array(
            'headers' => $this->getHeaders(),
            'body' => array(
                'attachment' => base64_encode(file_get_contents($file)),
                'name' => $uid,
                'filename' => basename($file)
            )
        ));

        $code = wp_remote_retrieve_response_code($response);

        if ($code >= 400) {
            throw new Exception('Invalid code return by cloud api');
        }

        return true;
    }

    public function uploadCustomFile($uid, $file)
    {
        $body = array(
            'attachment' => base64_encode(file_get_contents($file)),
            'uid' => $uid,
            'filename' => basename($file),
            'container' => $this->brizyProject->getCloudContainer(),
        );
        $response = $this->http->post(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_CUSTOM_FILES, array(
            'headers' => $this->getHeaders(),
            'body' => $body
        ));

        $code = wp_remote_retrieve_response_code($response);

        if ($code >= 400) {
            throw new Exception('Invalid code return by cloud api');
        }

        return true;
    }


    /**
     * @param $font
     *
     * Ex:
     *  [
     * 'id'      => 'askdalskdlaksd',
     * 'family'  => 'proxima-nova',
     * 'type'    => 'uploaded',
     * 'weights' => [
     * '400' => [
     * 'ttf'   => codecept_data_dir( 'fonts/pn-regular-webfont.ttf' ),
     * 'eot'   => codecept_data_dir( 'fonts/pn-regular-webfont.eot' ),
     * 'woff'  => codecept_data_dir( 'fonts/pn-regular-webfont.woff' ),
     * 'woff2' => codecept_data_dir( 'fonts/pn-regular-webfont.woff2' ),
     * ],
     * '500' => [
     * 'eot'   => codecept_data_dir( 'fonts/pn-medium-webfont.eot' ),
     * 'woff'  => codecept_data_dir( 'fonts/pn-medium-webfont.woff' ),
     * 'woff2' => codecept_data_dir( 'fonts/pn-medium-webfont.woff2' ),
     * ],
     * '700' => [
     * 'eot'   => codecept_data_dir( 'fonts/pn-bold-webfont.eot' ),
     * 'woff'  => codecept_data_dir( 'fonts/pn-bold-webfont.woff' ),
     * 'woff2' => codecept_data_dir( 'fonts/pn-bold-webfont.woff2' ),
     * ],
     * ]
     * ];
     *
     * @return bool
     * @throws Exception
     */
    public function createFont($font)
    {

        $params = array(
            'container' => $this->brizyProject->getCloudContainer(),
            'uid' => $font['id'],
            'family' => $font['family'],
        );

        // prepare font data
        foreach ($font['weights'] as $weigth => $files) {
            foreach ($files as $type => $file) {
                $params["files[$weigth][$type]"] = new CURLFile($file);
            }
        }
        unset($font['weights']);

        $file_upload_request = function ($handle_or_parameters, $request = '', $url = '') use ($params) {
            $this->updateWPHTTPRequest($handle_or_parameters, $params);
        };
        // handle cURL requests
        add_action('http_api_curl', $file_upload_request, 10);
        // handle fsockopen
        add_action('requests-fsockopen.before_send', $file_upload_request, 10, 3);

        $response = $this->http->post(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_FONTS, array(
            'headers' => $this->getHeaders(['Content-Type' => 'multipart/form-data']),
            'body' => $params,
            'timeout' => 40
        ));

        remove_action('http_api_curl', $file_upload_request);
        remove_action('requests-fsockopen.before_send', $file_upload_request);

        $code = wp_remote_retrieve_response_code($response);

        if ($code >= 400) {
            throw new Exception('Invalid code return by cloud api');
        }

        return json_decode(wp_remote_retrieve_body($response));
    }

    public function getFont($uid)
    {
        $response = $this->getCloudEntity(Brizy_Config::CLOUD_ENDPOINT . Brizy_Config::CLOUD_FONTS . "/{$uid}");

        if (is_array($response)) {
            return $response;
        }

        return null;
    }


    /**
     * @param $endpoint
     * @param $filters
     *
     * @return array|mixed|object|null
     */
    private function getCloudEntity($endpoint, $filters = array())
    {

        $http_build_query = http_build_query($filters);

        if ($http_build_query) {
            $http_build_query = '?' . $http_build_query;
        }

        $url = $endpoint . $http_build_query;
        $response = $this->http->get($url, array('headers' => $this->getHeaders()));

        $code = wp_remote_retrieve_response_code($response);
        if ($code == 200) {
            return (array)json_decode($response['body']);
        }

        return null;
    }

    /**
     * @param $endpoint
     * @param $filters
     *
     * @return array|mixed|object|null
     */
    private function getCloudEntityByContainer($endpoint, $filters = array())
    {

        $filters = array_merge($filters, ['container' => $this->brizyProject->getCloudContainer()]);

        return $this->getCloudEntity($endpoint, $filters);
    }

    private function updateWPHTTPRequest(&$handle_or_parameters, $form_body_arguments)
    {
        if (function_exists('curl_init') && function_exists('curl_exec')) {
            curl_setopt($handle_or_parameters, CURLOPT_POSTFIELDS, $form_body_arguments);
        } elseif (function_exists('fsockopen')) {
            $form_fields = [];
            $form_files = [];
            foreach ($form_body_arguments as $name => $value) {
                if (file_exists($value)) {
                    // Not great for large files since it dumps into memory but works well for small files
                    $form_files[$name] = file_get_contents($value);
                } else {
                    $form_fields[$name] = $value;
                }
            }

            function build_data_files($boundary, $fields, $files)
            {
                $data = '';
                $eol = "\r\n";

                $delimiter = '-------------' . $boundary;

                foreach ($fields as $name => $content) {
                    $data .= "--" . $delimiter . $eol
                        . 'Content-Disposition: form-data; name="' . $name . "\"" . $eol . $eol
                        . $content . $eol;
                }

                foreach ($files as $name => $content) {
                    $data .= "--" . $delimiter . $eol
                        . 'Content-Disposition: form-data; name="' . $name . '"; filename="' . $name . '"' . $eol
                        //. 'Content-Type: image/png'.$eol
                        . 'Content-Transfer-Encoding: binary' . $eol;

                    $data .= $eol;
                    $data .= $content . $eol;
                }
                $data .= "--" . $delimiter . "--" . $eol;

                return $data;
            }

            $boundary = uniqid("", true);
            $handle_or_parameters = build_data_files($boundary, $form_fields, $form_files);
        }
    }

}
