-- MySQL dump 10.13  Distrib 5.7.24, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: brizy
-- ------------------------------------------------------
-- Server version	5.6.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE = @@TIME_ZONE */;
/*!40103 SET TIME_ZONE = '+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */;
/*!40101 SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;

--
-- Table structure for table `wp_commentmeta`
--

DROP TABLE IF EXISTS `wp_commentmeta`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_commentmeta`
(
    `meta_id`    bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `comment_id` bigint(20) unsigned NOT NULL                DEFAULT '0',
    `meta_key`   varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
    `meta_value` longtext COLLATE utf8mb4_unicode_520_ci,
    PRIMARY KEY (`meta_id`),
    KEY `comment_id` (`comment_id`),
    KEY `meta_key` (`meta_key`(191))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_commentmeta`
--

LOCK TABLES `wp_commentmeta` WRITE;
/*!40000 ALTER TABLE `wp_commentmeta`
    DISABLE KEYS */;
/*!40000 ALTER TABLE `wp_commentmeta`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wp_comments`
--

DROP TABLE IF EXISTS `wp_comments`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_comments`
(
    `comment_ID`           bigint(20) unsigned                         NOT NULL AUTO_INCREMENT,
    `comment_post_ID`      bigint(20) unsigned                         NOT NULL DEFAULT '0',
    `comment_author`       tinytext COLLATE utf8mb4_unicode_520_ci     NOT NULL,
    `comment_author_email` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `comment_author_url`   varchar(200) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `comment_author_IP`    varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `comment_date`         datetime                                    NOT NULL DEFAULT '0000-00-00 00:00:00',
    `comment_date_gmt`     datetime                                    NOT NULL DEFAULT '0000-00-00 00:00:00',
    `comment_content`      text COLLATE utf8mb4_unicode_520_ci         NOT NULL,
    `comment_karma`        int(11)                                     NOT NULL DEFAULT '0',
    `comment_approved`     varchar(20) COLLATE utf8mb4_unicode_520_ci  NOT NULL DEFAULT '1',
    `comment_agent`        varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `comment_type`         varchar(20) COLLATE utf8mb4_unicode_520_ci  NOT NULL DEFAULT '',
    `comment_parent`       bigint(20) unsigned                         NOT NULL DEFAULT '0',
    `user_id`              bigint(20) unsigned                         NOT NULL DEFAULT '0',
    PRIMARY KEY (`comment_ID`),
    KEY `comment_post_ID` (`comment_post_ID`),
    KEY `comment_approved_date_gmt` (`comment_approved`, `comment_date_gmt`),
    KEY `comment_date_gmt` (`comment_date_gmt`),
    KEY `comment_parent` (`comment_parent`),
    KEY `comment_author_email` (`comment_author_email`(10))
) ENGINE = InnoDB
  AUTO_INCREMENT = 2
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_comments`
--

--
-- Table structure for table `wp_links`
--

DROP TABLE IF EXISTS `wp_links`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_links`
(
    `link_id`          bigint(20) unsigned                         NOT NULL AUTO_INCREMENT,
    `link_url`         varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `link_name`        varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `link_image`       varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `link_target`      varchar(25) COLLATE utf8mb4_unicode_520_ci  NOT NULL DEFAULT '',
    `link_description` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `link_visible`     varchar(20) COLLATE utf8mb4_unicode_520_ci  NOT NULL DEFAULT 'Y',
    `link_owner`       bigint(20) unsigned                         NOT NULL DEFAULT '1',
    `link_rating`      int(11)                                     NOT NULL DEFAULT '0',
    `link_updated`     datetime                                    NOT NULL DEFAULT '0000-00-00 00:00:00',
    `link_rel`         varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `link_notes`       mediumtext COLLATE utf8mb4_unicode_520_ci   NOT NULL,
    `link_rss`         varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    PRIMARY KEY (`link_id`),
    KEY `link_visible` (`link_visible`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_links`
--

--
-- Table structure for table `wp_options`
--

DROP TABLE IF EXISTS `wp_options`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_options`
(
    `option_id`    bigint(20) unsigned                         NOT NULL AUTO_INCREMENT,
    `option_name`  varchar(191) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `option_value` longtext COLLATE utf8mb4_unicode_520_ci     NOT NULL,
    `autoload`     varchar(20) COLLATE utf8mb4_unicode_520_ci  NOT NULL DEFAULT 'yes',
    PRIMARY KEY (`option_id`),
    UNIQUE KEY `option_name` (`option_name`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 127
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_options`
--

LOCK TABLES `wp_options` WRITE;
/*!40000 ALTER TABLE `wp_options`
    DISABLE KEYS */;
INSERT INTO `wp_options`
VALUES (1, 'siteurl', 'http://brizy-test.local', 'yes'),
       (2, 'home', 'http://brizy-test.local', 'yes'),
       (3, 'blogname', 'Brizy', 'yes'),
       (4, 'blogdescription', 'Just another WordPress site', 'yes'),
       (5, 'users_can_register', '0', 'yes'),
       (6, 'admin_email', 'alecszaharia@brizy.loca', 'yes'),
       (7, 'start_of_week', '1', 'yes'),
       (8, 'use_balanceTags', '0', 'yes'),
       (9, 'use_smilies', '1', 'yes'),
       (10, 'require_name_email', '1', 'yes'),
       (11, 'comments_notify', '1', 'yes'),
       (12, 'posts_per_rss', '10', 'yes'),
       (13, 'rss_use_excerpt', '0', 'yes'),
       (14, 'mailserver_url', 'mail.example.com', 'yes'),
       (15, 'mailserver_login', 'login@example.com', 'yes'),
       (16, 'mailserver_pass', 'password', 'yes'),
       (17, 'mailserver_port', '110', 'yes'),
       (18, 'default_category', '1', 'yes'),
       (19, 'default_comment_status', 'open', 'yes'),
       (20, 'default_ping_status', 'open', 'yes'),
       (21, 'default_pingback_flag', '0', 'yes'),
       (22, 'posts_per_page', '10', 'yes'),
       (23, 'date_format', 'F j, Y', 'yes'),
       (24, 'time_format', 'g:i a', 'yes'),
       (25, 'links_updated_date_format', 'F j, Y g:i a', 'yes'),
       (26, 'comment_moderation', '0', 'yes'),
       (27, 'moderation_notify', '1', 'yes'),
       (28, 'permalink_structure', '', 'yes'),
       (29, 'rewrite_rules', '', 'yes'),
       (30, 'hack_file', '0', 'yes'),
       (31, 'blog_charset', 'UTF-8', 'yes'),
       (32, 'moderation_keys', '', 'no'),
       (33, 'active_plugins', 'a:0:{}', 'yes'),
       (34, 'category_base', '', 'yes'),
       (35, 'ping_sites', 'http://rpc.pingomatic.com/', 'yes'),
       (36, 'comment_max_links', '2', 'yes'),
       (37, 'gmt_offset', '0', 'yes'),
       (38, 'default_email_category', '1', 'yes'),
       (39, 'recently_edited', '', 'no'),
       (40, 'template', 'twentynineteen', 'yes'),
       (41, 'stylesheet', 'twentynineteen', 'yes'),
       (42, 'comment_whitelist', '1', 'yes'),
       (43, 'blacklist_keys', '', 'no'),
       (44, 'comment_registration', '0', 'yes'),
       (45, 'html_type', 'text/html', 'yes'),
       (46, 'use_trackback', '0', 'yes'),
       (47, 'default_role', 'subscriber', 'yes'),
       (48, 'db_version', '43764', 'yes'),
       (49, 'uploads_use_yearmonth_folders', '1', 'yes'),
       (50, 'upload_path', '', 'yes'),
       (51, 'blog_public', '0', 'yes'),
       (52, 'default_link_category', '2', 'yes'),
       (53, 'show_on_front', 'posts', 'yes'),
       (54, 'tag_base', '', 'yes'),
       (55, 'show_avatars', '1', 'yes'),
       (56, 'avatar_rating', 'G', 'yes'),
       (57, 'upload_url_path', '', 'yes'),
       (58, 'thumbnail_size_w', '150', 'yes'),
       (59, 'thumbnail_size_h', '150', 'yes'),
       (60, 'thumbnail_crop', '1', 'yes'),
       (61, 'medium_size_w', '300', 'yes'),
       (62, 'medium_size_h', '300', 'yes'),
       (63, 'avatar_default', 'mystery', 'yes'),
       (64, 'large_size_w', '1024', 'yes'),
       (65, 'large_size_h', '1024', 'yes'),
       (66, 'image_default_link_type', 'none', 'yes'),
       (67, 'image_default_size', '', 'yes'),
       (68, 'image_default_align', '', 'yes'),
       (69, 'close_comments_for_old_posts', '0', 'yes'),
       (70, 'close_comments_days_old', '14', 'yes'),
       (71, 'thread_comments', '1', 'yes'),
       (72, 'thread_comments_depth', '5', 'yes'),
       (73, 'page_comments', '0', 'yes'),
       (74, 'comments_per_page', '50', 'yes'),
       (75, 'default_comments_page', 'newest', 'yes'),
       (76, 'comment_order', 'asc', 'yes'),
       (77, 'sticky_posts', 'a:0:{}', 'yes'),
       (78, 'widget_categories',
        'a:2:{i:2;a:4:{s:5:\"title\";s:0:\"\";s:5:\"count\";i:0;s:12:\"hierarchical\";i:0;s:8:\"dropdown\";i:0;}s:12:\"_multiwidget\";i:1;}',
        'yes'),
       (79, 'widget_text', 'a:0:{}', 'yes'),
       (80, 'widget_rss', 'a:0:{}', 'yes'),
       (81, 'uninstall_plugins', 'a:0:{}', 'no'),
       (82, 'timezone_string', '', 'yes'),
       (83, 'page_for_posts', '0', 'yes'),
       (84, 'page_on_front', '0', 'yes'),
       (85, 'default_post_format', '0', 'yes'),
       (86, 'link_manager_enabled', '0', 'yes'),
       (87, 'finished_splitting_shared_terms', '1', 'yes'),
       (88, 'site_icon', '0', 'yes'),
       (89, 'medium_large_size_w', '768', 'yes'),
       (90, 'medium_large_size_h', '0', 'yes'),
       (91, 'wp_page_for_privacy_policy', '3', 'yes'),
       (92, 'show_comments_cookies_opt_in', '0', 'yes'),
       (93, 'initial_db_version', '43764', 'yes'),
       (94, 'wp_user_roles',
        'a:5:{s:13:\"administrator\";a:2:{s:4:\"name\";s:13:\"Administrator\";s:12:\"capabilities\";a:61:{s:13:\"switch_themes\";b:1;s:11:\"edit_themes\";b:1;s:16:\"activate_plugins\";b:1;s:12:\"edit_plugins\";b:1;s:10:\"edit_users\";b:1;s:10:\"edit_files\";b:1;s:14:\"manage_options\";b:1;s:17:\"moderate_comments\";b:1;s:17:\"manage_categories\";b:1;s:12:\"manage_links\";b:1;s:12:\"upload_files\";b:1;s:6:\"import\";b:1;s:15:\"unfiltered_html\";b:1;s:10:\"edit_posts\";b:1;s:17:\"edit_others_posts\";b:1;s:20:\"edit_published_posts\";b:1;s:13:\"publish_posts\";b:1;s:10:\"edit_pages\";b:1;s:4:\"read\";b:1;s:8:\"level_10\";b:1;s:7:\"level_9\";b:1;s:7:\"level_8\";b:1;s:7:\"level_7\";b:1;s:7:\"level_6\";b:1;s:7:\"level_5\";b:1;s:7:\"level_4\";b:1;s:7:\"level_3\";b:1;s:7:\"level_2\";b:1;s:7:\"level_1\";b:1;s:7:\"level_0\";b:1;s:17:\"edit_others_pages\";b:1;s:20:\"edit_published_pages\";b:1;s:13:\"publish_pages\";b:1;s:12:\"delete_pages\";b:1;s:19:\"delete_others_pages\";b:1;s:22:\"delete_published_pages\";b:1;s:12:\"delete_posts\";b:1;s:19:\"delete_others_posts\";b:1;s:22:\"delete_published_posts\";b:1;s:20:\"delete_private_posts\";b:1;s:18:\"edit_private_posts\";b:1;s:18:\"read_private_posts\";b:1;s:20:\"delete_private_pages\";b:1;s:18:\"edit_private_pages\";b:1;s:18:\"read_private_pages\";b:1;s:12:\"delete_users\";b:1;s:12:\"create_users\";b:1;s:17:\"unfiltered_upload\";b:1;s:14:\"edit_dashboard\";b:1;s:14:\"update_plugins\";b:1;s:14:\"delete_plugins\";b:1;s:15:\"install_plugins\";b:1;s:13:\"update_themes\";b:1;s:14:\"install_themes\";b:1;s:11:\"update_core\";b:1;s:10:\"list_users\";b:1;s:12:\"remove_users\";b:1;s:13:\"promote_users\";b:1;s:18:\"edit_theme_options\";b:1;s:13:\"delete_themes\";b:1;s:6:\"export\";b:1;}}s:6:\"editor\";a:2:{s:4:\"name\";s:6:\"Editor\";s:12:\"capabilities\";a:34:{s:17:\"moderate_comments\";b:1;s:17:\"manage_categories\";b:1;s:12:\"manage_links\";b:1;s:12:\"upload_files\";b:1;s:15:\"unfiltered_html\";b:1;s:10:\"edit_posts\";b:1;s:17:\"edit_others_posts\";b:1;s:20:\"edit_published_posts\";b:1;s:13:\"publish_posts\";b:1;s:10:\"edit_pages\";b:1;s:4:\"read\";b:1;s:7:\"level_7\";b:1;s:7:\"level_6\";b:1;s:7:\"level_5\";b:1;s:7:\"level_4\";b:1;s:7:\"level_3\";b:1;s:7:\"level_2\";b:1;s:7:\"level_1\";b:1;s:7:\"level_0\";b:1;s:17:\"edit_others_pages\";b:1;s:20:\"edit_published_pages\";b:1;s:13:\"publish_pages\";b:1;s:12:\"delete_pages\";b:1;s:19:\"delete_others_pages\";b:1;s:22:\"delete_published_pages\";b:1;s:12:\"delete_posts\";b:1;s:19:\"delete_others_posts\";b:1;s:22:\"delete_published_posts\";b:1;s:20:\"delete_private_posts\";b:1;s:18:\"edit_private_posts\";b:1;s:18:\"read_private_posts\";b:1;s:20:\"delete_private_pages\";b:1;s:18:\"edit_private_pages\";b:1;s:18:\"read_private_pages\";b:1;}}s:6:\"author\";a:2:{s:4:\"name\";s:6:\"Author\";s:12:\"capabilities\";a:10:{s:12:\"upload_files\";b:1;s:10:\"edit_posts\";b:1;s:20:\"edit_published_posts\";b:1;s:13:\"publish_posts\";b:1;s:4:\"read\";b:1;s:7:\"level_2\";b:1;s:7:\"level_1\";b:1;s:7:\"level_0\";b:1;s:12:\"delete_posts\";b:1;s:22:\"delete_published_posts\";b:1;}}s:11:\"contributor\";a:2:{s:4:\"name\";s:11:\"Contributor\";s:12:\"capabilities\";a:5:{s:10:\"edit_posts\";b:1;s:4:\"read\";b:1;s:7:\"level_1\";b:1;s:7:\"level_0\";b:1;s:12:\"delete_posts\";b:1;}}s:10:\"subscriber\";a:2:{s:4:\"name\";s:10:\"Subscriber\";s:12:\"capabilities\";a:2:{s:4:\"read\";b:1;s:7:\"level_0\";b:1;}}}',
        'yes'),
       (95, 'fresh_site', '1', 'yes'),
       (96, 'widget_search', 'a:2:{i:2;a:1:{s:5:\"title\";s:0:\"\";}s:12:\"_multiwidget\";i:1;}', 'yes'),
       (97, 'widget_recent-posts',
        'a:2:{i:2;a:2:{s:5:\"title\";s:0:\"\";s:6:\"number\";i:5;}s:12:\"_multiwidget\";i:1;}', 'yes'),
       (98, 'widget_recent-comments',
        'a:2:{i:2;a:2:{s:5:\"title\";s:0:\"\";s:6:\"number\";i:5;}s:12:\"_multiwidget\";i:1;}', 'yes'),
       (99, 'widget_archives',
        'a:2:{i:2;a:3:{s:5:\"title\";s:0:\"\";s:5:\"count\";i:0;s:8:\"dropdown\";i:0;}s:12:\"_multiwidget\";i:1;}',
        'yes'),
       (100, 'widget_meta', 'a:2:{i:2;a:1:{s:5:\"title\";s:0:\"\";}s:12:\"_multiwidget\";i:1;}', 'yes'),
       (101, 'sidebars_widgets',
        'a:5:{s:19:\"wp_inactive_widgets\";a:0:{}s:9:\"sidebar-1\";a:6:{i:0;s:8:\"search-2\";i:1;s:14:\"recent-posts-2\";i:2;s:17:\"recent-comments-2\";i:3;s:10:\"archives-2\";i:4;s:12:\"categories-2\";i:5;s:6:\"meta-2\";}s:9:\"sidebar-2\";a:0:{}s:9:\"sidebar-3\";a:0:{}s:13:\"array_version\";i:3;}',
        'yes'),
       (102, 'widget_pages', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
       (103, 'widget_calendar', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
       (104, 'widget_media_audio', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
       (105, 'widget_media_image', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
       (106, 'widget_media_gallery', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
       (107, 'widget_media_video', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
       (108, 'nonce_key', '-9-w=2pSw<kZoCzPJ,tPJ.=.{^].%EoV6tgArs:U%92DM|TL;@D.6xC<E<Jgk8wm', 'no'),
       (109, 'nonce_salt', ':8W~ji7Q+86 GNZ~*0_Q~6U!u?C%{eWRUbR=);,v/l,k,Lvl[Ct8wb^G<D+FWjZZ', 'no'),
       (110, 'widget_tag_cloud', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
       (111, 'widget_nav_menu', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
       (112, 'widget_custom_html', 'a:1:{s:12:\"_multiwidget\";i:1;}', 'yes'),
       (113, 'cron',
        'a:3:{i:1557309585;a:1:{s:34:\"wp_privacy_delete_old_export_files\";a:1:{s:32:\"40cd750bba9870f18aada2478b24840a\";a:3:{s:8:\"schedule\";s:6:\"hourly\";s:4:\"args\";a:0:{}s:8:\"interval\";i:3600;}}}i:1557349185;a:3:{s:16:\"wp_version_check\";a:1:{s:32:\"40cd750bba9870f18aada2478b24840a\";a:3:{s:8:\"schedule\";s:10:\"twicedaily\";s:4:\"args\";a:0:{}s:8:\"interval\";i:43200;}}s:17:\"wp_update_plugins\";a:1:{s:32:\"40cd750bba9870f18aada2478b24840a\";a:3:{s:8:\"schedule\";s:10:\"twicedaily\";s:4:\"args\";a:0:{}s:8:\"interval\";i:43200;}}s:16:\"wp_update_themes\";a:1:{s:32:\"40cd750bba9870f18aada2478b24840a\";a:3:{s:8:\"schedule\";s:10:\"twicedaily\";s:4:\"args\";a:0:{}s:8:\"interval\";i:43200;}}}s:7:\"version\";i:2;}',
        'yes'),
       (114, 'theme_mods_twentynineteen', 'a:1:{s:18:\"custom_css_post_id\";i:-1;}', 'yes'),
       (116, '_site_transient_update_core',
        'O:8:\"stdClass\":4:{s:7:\"updates\";a:4:{i:0;O:8:\"stdClass\":10:{s:8:\"response\";s:7:\"upgrade\";s:8:\"download\";s:57:\"https://downloads.wordpress.org/release/wordpress-5.2.zip\";s:6:\"locale\";s:5:\"en_US\";s:8:\"packages\";O:8:\"stdClass\":5:{s:4:\"full\";s:57:\"https://downloads.wordpress.org/release/wordpress-5.2.zip\";s:10:\"no_content\";s:68:\"https://downloads.wordpress.org/release/wordpress-5.2-no-content.zip\";s:11:\"new_bundled\";s:69:\"https://downloads.wordpress.org/release/wordpress-5.2-new-bundled.zip\";s:7:\"partial\";b:0;s:8:\"rollback\";b:0;}s:7:\"current\";s:3:\"5.2\";s:7:\"version\";s:3:\"5.2\";s:11:\"php_version\";s:6:\"5.6.20\";s:13:\"mysql_version\";s:3:\"5.0\";s:11:\"new_bundled\";s:3:\"5.0\";s:15:\"partial_version\";s:0:\"\";}i:1;O:8:\"stdClass\":11:{s:8:\"response\";s:10:\"autoupdate\";s:8:\"download\";s:57:\"https://downloads.wordpress.org/release/wordpress-5.2.zip\";s:6:\"locale\";s:5:\"en_US\";s:8:\"packages\";O:8:\"stdClass\":5:{s:4:\"full\";s:57:\"https://downloads.wordpress.org/release/wordpress-5.2.zip\";s:10:\"no_content\";s:68:\"https://downloads.wordpress.org/release/wordpress-5.2-no-content.zip\";s:11:\"new_bundled\";s:69:\"https://downloads.wordpress.org/release/wordpress-5.2-new-bundled.zip\";s:7:\"partial\";b:0;s:8:\"rollback\";b:0;}s:7:\"current\";s:3:\"5.2\";s:7:\"version\";s:3:\"5.2\";s:11:\"php_version\";s:6:\"5.6.20\";s:13:\"mysql_version\";s:3:\"5.0\";s:11:\"new_bundled\";s:3:\"5.0\";s:15:\"partial_version\";s:0:\"\";s:9:\"new_files\";s:1:\"1\";}i:2;O:8:\"stdClass\":11:{s:8:\"response\";s:10:\"autoupdate\";s:8:\"download\";s:59:\"https://downloads.wordpress.org/release/wordpress-5.1.1.zip\";s:6:\"locale\";s:5:\"en_US\";s:8:\"packages\";O:8:\"stdClass\":5:{s:4:\"full\";s:59:\"https://downloads.wordpress.org/release/wordpress-5.1.1.zip\";s:10:\"no_content\";s:70:\"https://downloads.wordpress.org/release/wordpress-5.1.1-no-content.zip\";s:11:\"new_bundled\";s:71:\"https://downloads.wordpress.org/release/wordpress-5.1.1-new-bundled.zip\";s:7:\"partial\";b:0;s:8:\"rollback\";b:0;}s:7:\"current\";s:5:\"5.1.1\";s:7:\"version\";s:5:\"5.1.1\";s:11:\"php_version\";s:5:\"5.2.4\";s:13:\"mysql_version\";s:3:\"5.0\";s:11:\"new_bundled\";s:3:\"5.0\";s:15:\"partial_version\";s:0:\"\";s:9:\"new_files\";s:1:\"1\";}i:3;O:8:\"stdClass\":11:{s:8:\"response\";s:10:\"autoupdate\";s:8:\"download\";s:59:\"https://downloads.wordpress.org/release/wordpress-5.0.4.zip\";s:6:\"locale\";s:5:\"en_US\";s:8:\"packages\";O:8:\"stdClass\":5:{s:4:\"full\";s:59:\"https://downloads.wordpress.org/release/wordpress-5.0.4.zip\";s:10:\"no_content\";s:70:\"https://downloads.wordpress.org/release/wordpress-5.0.4-no-content.zip\";s:11:\"new_bundled\";s:71:\"https://downloads.wordpress.org/release/wordpress-5.0.4-new-bundled.zip\";s:7:\"partial\";b:0;s:8:\"rollback\";b:0;}s:7:\"current\";s:5:\"5.0.4\";s:7:\"version\";s:5:\"5.0.4\";s:11:\"php_version\";s:5:\"5.2.4\";s:13:\"mysql_version\";s:3:\"5.0\";s:11:\"new_bundled\";s:3:\"5.0\";s:15:\"partial_version\";s:0:\"\";s:9:\"new_files\";s:1:\"1\";}}s:12:\"last_checked\";i:1557305988;s:15:\"version_checked\";s:9:\"5.0-beta5\";s:12:\"translations\";a:0:{}}',
        'no'),
       (119, '_site_transient_timeout_theme_roots', '1557307789', 'no'),
       (120, '_site_transient_theme_roots',
        'a:10:{s:5:\"astra\";s:7:\"/themes\";s:10:\"storefront\";s:7:\"/themes\";s:14:\"the-core-child\";s:7:\"/themes\";s:15:\"the-core-parent\";s:7:\"/themes\";s:62:\"themefuse-integrare-the-journal-ee07557a7b25/the-journal-child\";s:7:\"/themes\";s:56:\"themefuse-integrare-the-journal-ee07557a7b25/the-journal\";s:7:\"/themes\";s:13:\"twentyfifteen\";s:7:\"/themes\";s:14:\"twentynineteen\";s:7:\"/themes\";s:15:\"twentyseventeen\";s:7:\"/themes\";s:13:\"twentysixteen\";s:7:\"/themes\";}',
        'no'),
       (123, '_site_transient_update_themes',
        'O:8:\"stdClass\":4:{s:12:\"last_checked\";i:1557305998;s:7:\"checked\";a:10:{s:5:\"astra\";s:5:\"1.6.3\";s:10:\"storefront\";s:5:\"2.4.2\";s:14:\"the-core-child\";s:3:\"1.0\";s:15:\"the-core-parent\";s:6:\"1.0.32\";s:62:\"themefuse-integrare-the-journal-ee07557a7b25/the-journal-child\";s:3:\"1.0\";s:56:\"themefuse-integrare-the-journal-ee07557a7b25/the-journal\";s:6:\"1.0.14\";s:13:\"twentyfifteen\";s:3:\"1.9\";s:14:\"twentynineteen\";s:3:\"1.0\";s:15:\"twentyseventeen\";s:3:\"1.7\";s:13:\"twentysixteen\";s:3:\"1.5\";}s:8:\"response\";a:6:{s:5:\"astra\";a:4:{s:5:\"theme\";s:5:\"astra\";s:11:\"new_version\";s:5:\"1.8.3\";s:3:\"url\";s:35:\"https://wordpress.org/themes/astra/\";s:7:\"package\";s:53:\"https://downloads.wordpress.org/theme/astra.1.8.3.zip\";}s:10:\"storefront\";a:4:{s:5:\"theme\";s:10:\"storefront\";s:11:\"new_version\";s:5:\"2.4.6\";s:3:\"url\";s:40:\"https://wordpress.org/themes/storefront/\";s:7:\"package\";s:58:\"https://downloads.wordpress.org/theme/storefront.2.4.6.zip\";}s:13:\"twentyfifteen\";a:4:{s:5:\"theme\";s:13:\"twentyfifteen\";s:11:\"new_version\";s:3:\"2.5\";s:3:\"url\";s:43:\"https://wordpress.org/themes/twentyfifteen/\";s:7:\"package\";s:59:\"https://downloads.wordpress.org/theme/twentyfifteen.2.5.zip\";}s:14:\"twentynineteen\";a:4:{s:5:\"theme\";s:14:\"twentynineteen\";s:11:\"new_version\";s:3:\"1.4\";s:3:\"url\";s:44:\"https://wordpress.org/themes/twentynineteen/\";s:7:\"package\";s:60:\"https://downloads.wordpress.org/theme/twentynineteen.1.4.zip\";}s:15:\"twentyseventeen\";a:4:{s:5:\"theme\";s:15:\"twentyseventeen\";s:11:\"new_version\";s:3:\"2.2\";s:3:\"url\";s:45:\"https://wordpress.org/themes/twentyseventeen/\";s:7:\"package\";s:61:\"https://downloads.wordpress.org/theme/twentyseventeen.2.2.zip\";}s:13:\"twentysixteen\";a:4:{s:5:\"theme\";s:13:\"twentysixteen\";s:11:\"new_version\";s:3:\"2.0\";s:3:\"url\";s:43:\"https://wordpress.org/themes/twentysixteen/\";s:7:\"package\";s:59:\"https://downloads.wordpress.org/theme/twentysixteen.2.0.zip\";}}s:12:\"translations\";a:0:{}}',
        'no'),
       (124, '_site_transient_update_plugins',
        'O:8:\"stdClass\":5:{s:12:\"last_checked\";i:1557306000;s:7:\"checked\";a:42:{s:30:\"advanced-custom-fields/acf.php\";s:5:\"5.7.7\";s:19:\"akismet/akismet.php\";s:5:\"4.0.8\";s:51:\"all-in-one-wp-migration/all-in-one-wp-migration.php\";s:4:\"6.70\";s:43:\"all-in-one-seo-pack/all_in_one_seo_pack.php\";s:5:\"2.7.3\";s:35:\"astra-pro-sites/astra-pro-sites.php\";s:6:\"1.2.10\";s:27:\"astra-addon/astra-addon.php\";s:6:\"1.6.10\";s:43:\"astra-sites-staging/astra-sites-staging.php\";s:5:\"1.0.4\";s:27:\"astra-sites/astra-sites.php\";s:6:\"1.2.10\";s:15:\"brizy/brizy.php\";s:6:\"1.0.74\";s:23:\"brizy-pro/brizy-pro.php\";s:6:\"0.0.24\";s:30:\"caldera-forms/caldera-core.php\";s:7:\"1.7.1.4\";s:33:\"classic-editor/classic-editor.php\";s:3:\"1.4\";s:57:\"custom-post-type-generator/custom-post-type-generator.php\";s:5:\"2.4.1\";s:32:\"duplicate-page/duplicatepage.php\";s:3:\"2.6\";s:25:\"duplicator/duplicator.php\";s:6:\"1.2.40\";s:23:\"elementor/elementor.php\";s:5:\"2.3.1\";s:31:\"elementor-pro/elementor-pro.php\";s:6:\"2.1.12\";s:55:\"fly-dynamic-image-resizer/fly-dynamic-image-resizer.php\";s:5:\"2.0.5\";s:23:\"gutenberg/gutenberg.php\";s:5:\"1.9.1\";s:9:\"hello.php\";s:3:\"1.6\";s:33:\"imscsitecloner/imscsitecloner.php\";s:5:\"2.0.1\";s:19:\"jetpack/jetpack.php\";s:3:\"6.0\";s:35:\"litespeed-cache/litespeed-cache.php\";s:5:\"2.2.7\";s:21:\"mailpoet/mailpoet.php\";s:6:\"3.19.3\";s:53:\"portfolio-filter-gallery/portfolio-filter-gallery.php\";s:6:\"0.2.27\";s:43:\"portfolio-post-type/portfolio-post-type.php\";s:5:\"0.9.3\";s:55:\"resize-image-after-upload/resize-image-after-upload.php\";s:5:\"1.8.4\";s:35:\"responsive-menu/responsive-menu.php\";s:6:\"3.1.18\";s:59:\"ultimate-social-media-icons/ultimate_social_media_icons.php\";s:5:\"2.0.0\";s:37:\"translatepress-multilingual/index.php\";s:5:\"1.1.7\";s:17:\"unyson/unyson.php\";s:6:\"2.7.14\";s:17:\"weglot/weglot.php\";s:5:\"2.2.1\";s:27:\"woocommerce/woocommerce.php\";s:5:\"3.4.3\";s:48:\"woocommerce-social-media-share-buttons/index.php\";s:5:\"1.3.0\";s:57:\"woocommerce-gateway-stripe/woocommerce-gateway-stripe.php\";s:5:\"4.1.7\";s:35:\"wordpress-https/wordpress-https.php\";s:5:\"3.4.0\";s:41:\"wordpress-importer/wordpress-importer.php\";s:5:\"0.6.4\";s:40:\"sitepress-multilingual-cms/sitepress.php\";s:5:\"4.0.8\";s:41:\"amazon-s3-and-cloudfront/wordpress-s3.php\";s:3:\"2.1\";s:27:\"wp-super-cache/wp-cache.php\";s:5:\"1.6.1\";s:45:\"wp-widgets-shortcode/wp-widgets-shortcode.php\";s:5:\"1.0.3\";s:24:\"wordpress-seo/wp-seo.php\";s:3:\"9.1\";}s:8:\"response\";a:26:{s:30:\"advanced-custom-fields/acf.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:36:\"w.org/plugins/advanced-custom-fields\";s:4:\"slug\";s:22:\"advanced-custom-fields\";s:6:\"plugin\";s:30:\"advanced-custom-fields/acf.php\";s:11:\"new_version\";s:6:\"5.7.12\";s:3:\"url\";s:53:\"https://wordpress.org/plugins/advanced-custom-fields/\";s:7:\"package\";s:72:\"https://downloads.wordpress.org/plugin/advanced-custom-fields.5.7.12.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:75:\"https://ps.w.org/advanced-custom-fields/assets/icon-256x256.png?rev=1082746\";s:2:\"1x\";s:75:\"https://ps.w.org/advanced-custom-fields/assets/icon-128x128.png?rev=1082746\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:78:\"https://ps.w.org/advanced-custom-fields/assets/banner-1544x500.jpg?rev=1729099\";s:2:\"1x\";s:77:\"https://ps.w.org/advanced-custom-fields/assets/banner-772x250.jpg?rev=1729102\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"4.9.9\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:19:\"akismet/akismet.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:21:\"w.org/plugins/akismet\";s:4:\"slug\";s:7:\"akismet\";s:6:\"plugin\";s:19:\"akismet/akismet.php\";s:11:\"new_version\";s:5:\"4.1.1\";s:3:\"url\";s:38:\"https://wordpress.org/plugins/akismet/\";s:7:\"package\";s:56:\"https://downloads.wordpress.org/plugin/akismet.4.1.1.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:59:\"https://ps.w.org/akismet/assets/icon-256x256.png?rev=969272\";s:2:\"1x\";s:59:\"https://ps.w.org/akismet/assets/icon-128x128.png?rev=969272\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:61:\"https://ps.w.org/akismet/assets/banner-772x250.jpg?rev=479904\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:3:\"5.2\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:51:\"all-in-one-wp-migration/all-in-one-wp-migration.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:37:\"w.org/plugins/all-in-one-wp-migration\";s:4:\"slug\";s:23:\"all-in-one-wp-migration\";s:6:\"plugin\";s:51:\"all-in-one-wp-migration/all-in-one-wp-migration.php\";s:11:\"new_version\";s:4:\"6.93\";s:3:\"url\";s:54:\"https://wordpress.org/plugins/all-in-one-wp-migration/\";s:7:\"package\";s:71:\"https://downloads.wordpress.org/plugin/all-in-one-wp-migration.6.93.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:76:\"https://ps.w.org/all-in-one-wp-migration/assets/icon-256x256.png?rev=2075535\";s:2:\"1x\";s:76:\"https://ps.w.org/all-in-one-wp-migration/assets/icon-128x128.png?rev=2075535\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:79:\"https://ps.w.org/all-in-one-wp-migration/assets/banner-1544x500.png?rev=2075535\";s:2:\"1x\";s:78:\"https://ps.w.org/all-in-one-wp-migration/assets/banner-772x250.png?rev=2075535\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:3:\"5.2\";s:12:\"requires_php\";s:6:\"5.2.17\";s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:43:\"all-in-one-seo-pack/all_in_one_seo_pack.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:33:\"w.org/plugins/all-in-one-seo-pack\";s:4:\"slug\";s:19:\"all-in-one-seo-pack\";s:6:\"plugin\";s:43:\"all-in-one-seo-pack/all_in_one_seo_pack.php\";s:11:\"new_version\";s:6:\"2.12.1\";s:3:\"url\";s:50:\"https://wordpress.org/plugins/all-in-one-seo-pack/\";s:7:\"package\";s:69:\"https://downloads.wordpress.org/plugin/all-in-one-seo-pack.2.12.1.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:72:\"https://ps.w.org/all-in-one-seo-pack/assets/icon-256x256.png?rev=2075006\";s:2:\"1x\";s:72:\"https://ps.w.org/all-in-one-seo-pack/assets/icon-128x128.png?rev=2075006\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:75:\"https://ps.w.org/all-in-one-seo-pack/assets/banner-1544x500.png?rev=1354894\";s:2:\"1x\";s:74:\"https://ps.w.org/all-in-one-seo-pack/assets/banner-772x250.png?rev=1354894\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:3:\"5.2\";s:12:\"requires_php\";s:5:\"5.2.4\";s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:27:\"astra-sites/astra-sites.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:25:\"w.org/plugins/astra-sites\";s:4:\"slug\";s:11:\"astra-sites\";s:6:\"plugin\";s:27:\"astra-sites/astra-sites.php\";s:11:\"new_version\";s:5:\"1.3.9\";s:3:\"url\";s:42:\"https://wordpress.org/plugins/astra-sites/\";s:7:\"package\";s:60:\"https://downloads.wordpress.org/plugin/astra-sites.1.3.9.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:64:\"https://ps.w.org/astra-sites/assets/icon-256x256.jpg?rev=1712437\";s:2:\"1x\";s:64:\"https://ps.w.org/astra-sites/assets/icon-128x128.jpg?rev=1712437\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:67:\"https://ps.w.org/astra-sites/assets/banner-1544x500.jpg?rev=1712437\";s:2:\"1x\";s:66:\"https://ps.w.org/astra-sites/assets/banner-772x250.jpg?rev=1712437\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";s:3:\"5.3\";s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:30:\"caldera-forms/caldera-core.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:27:\"w.org/plugins/caldera-forms\";s:4:\"slug\";s:13:\"caldera-forms\";s:6:\"plugin\";s:30:\"caldera-forms/caldera-core.php\";s:11:\"new_version\";s:5:\"1.8.4\";s:3:\"url\";s:44:\"https://wordpress.org/plugins/caldera-forms/\";s:7:\"package\";s:62:\"https://downloads.wordpress.org/plugin/caldera-forms.1.8.4.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:66:\"https://ps.w.org/caldera-forms/assets/icon-256x256.png?rev=1522173\";s:2:\"1x\";s:66:\"https://ps.w.org/caldera-forms/assets/icon-128x128.png?rev=1522173\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:69:\"https://ps.w.org/caldera-forms/assets/banner-1544x500.png?rev=1657327\";s:2:\"1x\";s:68:\"https://ps.w.org/caldera-forms/assets/banner-772x250.png?rev=1657327\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";s:3:\"5.6\";s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:57:\"custom-post-type-generator/custom-post-type-generator.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:40:\"w.org/plugins/custom-post-type-generator\";s:4:\"slug\";s:26:\"custom-post-type-generator\";s:6:\"plugin\";s:57:\"custom-post-type-generator/custom-post-type-generator.php\";s:11:\"new_version\";s:5:\"2.4.2\";s:3:\"url\";s:57:\"https://wordpress.org/plugins/custom-post-type-generator/\";s:7:\"package\";s:75:\"https://downloads.wordpress.org/plugin/custom-post-type-generator.2.4.2.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:79:\"https://ps.w.org/custom-post-type-generator/assets/icon-256x256.png?rev=1191738\";s:2:\"1x\";s:79:\"https://ps.w.org/custom-post-type-generator/assets/icon-128x128.png?rev=1191738\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:82:\"https://ps.w.org/custom-post-type-generator/assets/banner-1544x500.png?rev=1209667\";s:2:\"1x\";s:81:\"https://ps.w.org/custom-post-type-generator/assets/banner-772x250.png?rev=1191738\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:32:\"duplicate-page/duplicatepage.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:28:\"w.org/plugins/duplicate-page\";s:4:\"slug\";s:14:\"duplicate-page\";s:6:\"plugin\";s:32:\"duplicate-page/duplicatepage.php\";s:11:\"new_version\";s:3:\"3.5\";s:3:\"url\";s:45:\"https://wordpress.org/plugins/duplicate-page/\";s:7:\"package\";s:57:\"https://downloads.wordpress.org/plugin/duplicate-page.zip\";s:5:\"icons\";a:1:{s:2:\"1x\";s:67:\"https://ps.w.org/duplicate-page/assets/icon-128x128.jpg?rev=1412874\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:69:\"https://ps.w.org/duplicate-page/assets/banner-772x250.jpg?rev=1410328\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:25:\"duplicator/duplicator.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:24:\"w.org/plugins/duplicator\";s:4:\"slug\";s:10:\"duplicator\";s:6:\"plugin\";s:25:\"duplicator/duplicator.php\";s:11:\"new_version\";s:6:\"1.3.12\";s:3:\"url\";s:41:\"https://wordpress.org/plugins/duplicator/\";s:7:\"package\";s:60:\"https://downloads.wordpress.org/plugin/duplicator.1.3.12.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:63:\"https://ps.w.org/duplicator/assets/icon-256x256.png?rev=1298463\";s:2:\"1x\";s:63:\"https://ps.w.org/duplicator/assets/icon-128x128.png?rev=1298463\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:65:\"https://ps.w.org/duplicator/assets/banner-772x250.png?rev=1645055\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";s:6:\"5.2.17\";s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:23:\"elementor/elementor.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:23:\"w.org/plugins/elementor\";s:4:\"slug\";s:9:\"elementor\";s:6:\"plugin\";s:23:\"elementor/elementor.php\";s:11:\"new_version\";s:6:\"2.5.15\";s:3:\"url\";s:40:\"https://wordpress.org/plugins/elementor/\";s:7:\"package\";s:59:\"https://downloads.wordpress.org/plugin/elementor.2.5.15.zip\";s:5:\"icons\";a:3:{s:2:\"2x\";s:62:\"https://ps.w.org/elementor/assets/icon-256x256.png?rev=1427768\";s:2:\"1x\";s:54:\"https://ps.w.org/elementor/assets/icon.svg?rev=1426809\";s:3:\"svg\";s:54:\"https://ps.w.org/elementor/assets/icon.svg?rev=1426809\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:65:\"https://ps.w.org/elementor/assets/banner-1544x500.png?rev=1475479\";s:2:\"1x\";s:64:\"https://ps.w.org/elementor/assets/banner-772x250.png?rev=1475479\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";s:3:\"5.4\";s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:19:\"jetpack/jetpack.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:21:\"w.org/plugins/jetpack\";s:4:\"slug\";s:7:\"jetpack\";s:6:\"plugin\";s:19:\"jetpack/jetpack.php\";s:11:\"new_version\";s:5:\"7.3.0\";s:3:\"url\";s:38:\"https://wordpress.org/plugins/jetpack/\";s:7:\"package\";s:54:\"https://downloads.wordpress.org/plugin/jetpack.7.3.zip\";s:5:\"icons\";a:3:{s:2:\"2x\";s:60:\"https://ps.w.org/jetpack/assets/icon-256x256.png?rev=1791404\";s:2:\"1x\";s:52:\"https://ps.w.org/jetpack/assets/icon.svg?rev=1791404\";s:3:\"svg\";s:52:\"https://ps.w.org/jetpack/assets/icon.svg?rev=1791404\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:63:\"https://ps.w.org/jetpack/assets/banner-1544x500.png?rev=1791404\";s:2:\"1x\";s:62:\"https://ps.w.org/jetpack/assets/banner-772x250.png?rev=1791404\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:3:\"5.2\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:35:\"litespeed-cache/litespeed-cache.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:29:\"w.org/plugins/litespeed-cache\";s:4:\"slug\";s:15:\"litespeed-cache\";s:6:\"plugin\";s:35:\"litespeed-cache/litespeed-cache.php\";s:11:\"new_version\";s:7:\"2.9.7.2\";s:3:\"url\";s:46:\"https://wordpress.org/plugins/litespeed-cache/\";s:7:\"package\";s:66:\"https://downloads.wordpress.org/plugin/litespeed-cache.2.9.7.2.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:68:\"https://ps.w.org/litespeed-cache/assets/icon-256x256.png?rev=1574145\";s:2:\"1x\";s:68:\"https://ps.w.org/litespeed-cache/assets/icon-128x128.png?rev=1574145\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:71:\"https://ps.w.org/litespeed-cache/assets/banner-1544x500.png?rev=2031698\";s:2:\"1x\";s:70:\"https://ps.w.org/litespeed-cache/assets/banner-772x250.png?rev=2031698\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:21:\"mailpoet/mailpoet.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:22:\"w.org/plugins/mailpoet\";s:4:\"slug\";s:8:\"mailpoet\";s:6:\"plugin\";s:21:\"mailpoet/mailpoet.php\";s:11:\"new_version\";s:6:\"3.25.1\";s:3:\"url\";s:39:\"https://wordpress.org/plugins/mailpoet/\";s:7:\"package\";s:58:\"https://downloads.wordpress.org/plugin/mailpoet.3.25.1.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:61:\"https://ps.w.org/mailpoet/assets/icon-256x256.png?rev=1895745\";s:2:\"1x\";s:61:\"https://ps.w.org/mailpoet/assets/icon-128x128.png?rev=1706492\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:64:\"https://ps.w.org/mailpoet/assets/banner-1544x500.png?rev=2046588\";s:2:\"1x\";s:63:\"https://ps.w.org/mailpoet/assets/banner-772x250.png?rev=2046588\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:53:\"portfolio-filter-gallery/portfolio-filter-gallery.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:38:\"w.org/plugins/portfolio-filter-gallery\";s:4:\"slug\";s:24:\"portfolio-filter-gallery\";s:6:\"plugin\";s:53:\"portfolio-filter-gallery/portfolio-filter-gallery.php\";s:11:\"new_version\";s:5:\"1.0.2\";s:3:\"url\";s:55:\"https://wordpress.org/plugins/portfolio-filter-gallery/\";s:7:\"package\";s:73:\"https://downloads.wordpress.org/plugin/portfolio-filter-gallery.1.0.2.zip\";s:5:\"icons\";a:1:{s:2:\"1x\";s:77:\"https://ps.w.org/portfolio-filter-gallery/assets/icon-128x128.png?rev=2025758\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:79:\"https://ps.w.org/portfolio-filter-gallery/assets/banner-772x250.png?rev=2025758\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";s:3:\"5.4\";s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:43:\"portfolio-post-type/portfolio-post-type.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:33:\"w.org/plugins/portfolio-post-type\";s:4:\"slug\";s:19:\"portfolio-post-type\";s:6:\"plugin\";s:43:\"portfolio-post-type/portfolio-post-type.php\";s:11:\"new_version\";s:5:\"1.0.0\";s:3:\"url\";s:50:\"https://wordpress.org/plugins/portfolio-post-type/\";s:7:\"package\";s:68:\"https://downloads.wordpress.org/plugin/portfolio-post-type.1.0.0.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:71:\"https://ps.w.org/portfolio-post-type/assets/icon-256x256.png?rev=974090\";s:2:\"1x\";s:71:\"https://ps.w.org/portfolio-post-type/assets/icon-256x256.png?rev=974090\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:73:\"https://ps.w.org/portfolio-post-type/assets/banner-772x250.jpg?rev=497144\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.0.0\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:55:\"resize-image-after-upload/resize-image-after-upload.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:39:\"w.org/plugins/resize-image-after-upload\";s:4:\"slug\";s:25:\"resize-image-after-upload\";s:6:\"plugin\";s:55:\"resize-image-after-upload/resize-image-after-upload.php\";s:11:\"new_version\";s:5:\"1.8.6\";s:3:\"url\";s:56:\"https://wordpress.org/plugins/resize-image-after-upload/\";s:7:\"package\";s:74:\"https://downloads.wordpress.org/plugin/resize-image-after-upload.1.8.6.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:78:\"https://ps.w.org/resize-image-after-upload/assets/icon-256x256.png?rev=1940740\";s:2:\"1x\";s:78:\"https://ps.w.org/resize-image-after-upload/assets/icon-128x128.png?rev=1940740\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:81:\"https://ps.w.org/resize-image-after-upload/assets/banner-1544x500.png?rev=1940740\";s:2:\"1x\";s:80:\"https://ps.w.org/resize-image-after-upload/assets/banner-772x250.png?rev=1940740\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:35:\"responsive-menu/responsive-menu.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:29:\"w.org/plugins/responsive-menu\";s:4:\"slug\";s:15:\"responsive-menu\";s:6:\"plugin\";s:35:\"responsive-menu/responsive-menu.php\";s:11:\"new_version\";s:6:\"3.1.19\";s:3:\"url\";s:46:\"https://wordpress.org/plugins/responsive-menu/\";s:7:\"package\";s:65:\"https://downloads.wordpress.org/plugin/responsive-menu.3.1.19.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:68:\"https://ps.w.org/responsive-menu/assets/icon-256x256.png?rev=1782326\";s:2:\"1x\";s:68:\"https://ps.w.org/responsive-menu/assets/icon-128x128.png?rev=1782326\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:70:\"https://ps.w.org/responsive-menu/assets/banner-772x250.png?rev=1782326\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";s:3:\"5.4\";s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:59:\"ultimate-social-media-icons/ultimate_social_media_icons.php\";O:8:\"stdClass\":13:{s:2:\"id\";s:41:\"w.org/plugins/ultimate-social-media-icons\";s:4:\"slug\";s:27:\"ultimate-social-media-icons\";s:6:\"plugin\";s:59:\"ultimate-social-media-icons/ultimate_social_media_icons.php\";s:11:\"new_version\";s:5:\"2.2.2\";s:3:\"url\";s:58:\"https://wordpress.org/plugins/ultimate-social-media-icons/\";s:7:\"package\";s:76:\"https://downloads.wordpress.org/plugin/ultimate-social-media-icons.2.2.2.zip\";s:5:\"icons\";a:1:{s:2:\"1x\";s:80:\"https://ps.w.org/ultimate-social-media-icons/assets/icon-128x128.png?rev=1598977\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:82:\"https://ps.w.org/ultimate-social-media-icons/assets/banner-772x250.png?rev=1032920\";}s:11:\"banners_rtl\";a:0:{}s:14:\"upgrade_notice\";s:21:\"<p>Please upgrade</p>\";s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:37:\"translatepress-multilingual/index.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:41:\"w.org/plugins/translatepress-multilingual\";s:4:\"slug\";s:27:\"translatepress-multilingual\";s:6:\"plugin\";s:37:\"translatepress-multilingual/index.php\";s:11:\"new_version\";s:5:\"1.4.5\";s:3:\"url\";s:58:\"https://wordpress.org/plugins/translatepress-multilingual/\";s:7:\"package\";s:76:\"https://downloads.wordpress.org/plugin/translatepress-multilingual.1.4.5.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:80:\"https://ps.w.org/translatepress-multilingual/assets/icon-256x256.png?rev=1722670\";s:2:\"1x\";s:80:\"https://ps.w.org/translatepress-multilingual/assets/icon-128x128.png?rev=1722670\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:83:\"https://ps.w.org/translatepress-multilingual/assets/banner-1544x500.png?rev=1722670\";s:2:\"1x\";s:82:\"https://ps.w.org/translatepress-multilingual/assets/banner-772x250.png?rev=1722670\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:17:\"unyson/unyson.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:20:\"w.org/plugins/unyson\";s:4:\"slug\";s:6:\"unyson\";s:6:\"plugin\";s:17:\"unyson/unyson.php\";s:11:\"new_version\";s:6:\"2.7.22\";s:3:\"url\";s:37:\"https://wordpress.org/plugins/unyson/\";s:7:\"package\";s:56:\"https://downloads.wordpress.org/plugin/unyson.2.7.22.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:59:\"https://ps.w.org/unyson/assets/icon-256x256.jpg?rev=1034261\";s:2:\"1x\";s:59:\"https://ps.w.org/unyson/assets/icon-128x128.jpg?rev=1034260\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:62:\"https://ps.w.org/unyson/assets/banner-1544x500.png?rev=1034271\";s:2:\"1x\";s:61:\"https://ps.w.org/unyson/assets/banner-772x250.png?rev=1034270\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.0.3\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:17:\"weglot/weglot.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:20:\"w.org/plugins/weglot\";s:4:\"slug\";s:6:\"weglot\";s:6:\"plugin\";s:17:\"weglot/weglot.php\";s:11:\"new_version\";s:5:\"3.0.2\";s:3:\"url\";s:37:\"https://wordpress.org/plugins/weglot/\";s:7:\"package\";s:55:\"https://downloads.wordpress.org/plugin/weglot.3.0.2.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:59:\"https://ps.w.org/weglot/assets/icon-256x256.png?rev=1784581\";s:2:\"1x\";s:59:\"https://ps.w.org/weglot/assets/icon-128x128.png?rev=1784581\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:62:\"https://ps.w.org/weglot/assets/banner-1544x500.jpg?rev=1784581\";s:2:\"1x\";s:61:\"https://ps.w.org/weglot/assets/banner-772x250.jpg?rev=1784581\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";s:3:\"5.4\";s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:27:\"woocommerce/woocommerce.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:25:\"w.org/plugins/woocommerce\";s:4:\"slug\";s:11:\"woocommerce\";s:6:\"plugin\";s:27:\"woocommerce/woocommerce.php\";s:11:\"new_version\";s:5:\"3.6.2\";s:3:\"url\";s:42:\"https://wordpress.org/plugins/woocommerce/\";s:7:\"package\";s:60:\"https://downloads.wordpress.org/plugin/woocommerce.3.6.2.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:64:\"https://ps.w.org/woocommerce/assets/icon-256x256.png?rev=2075035\";s:2:\"1x\";s:64:\"https://ps.w.org/woocommerce/assets/icon-128x128.png?rev=2075035\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:67:\"https://ps.w.org/woocommerce/assets/banner-1544x500.png?rev=2075035\";s:2:\"1x\";s:66:\"https://ps.w.org/woocommerce/assets/banner-772x250.png?rev=2075035\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:3:\"5.2\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:57:\"woocommerce-gateway-stripe/woocommerce-gateway-stripe.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:40:\"w.org/plugins/woocommerce-gateway-stripe\";s:4:\"slug\";s:26:\"woocommerce-gateway-stripe\";s:6:\"plugin\";s:57:\"woocommerce-gateway-stripe/woocommerce-gateway-stripe.php\";s:11:\"new_version\";s:6:\"4.1.16\";s:3:\"url\";s:57:\"https://wordpress.org/plugins/woocommerce-gateway-stripe/\";s:7:\"package\";s:76:\"https://downloads.wordpress.org/plugin/woocommerce-gateway-stripe.4.1.16.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:79:\"https://ps.w.org/woocommerce-gateway-stripe/assets/icon-256x256.png?rev=1917495\";s:2:\"1x\";s:79:\"https://ps.w.org/woocommerce-gateway-stripe/assets/icon-128x128.png?rev=1917495\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:82:\"https://ps.w.org/woocommerce-gateway-stripe/assets/banner-1544x500.png?rev=1917495\";s:2:\"1x\";s:81:\"https://ps.w.org/woocommerce-gateway-stripe/assets/banner-772x250.png?rev=1917495\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";s:3:\"5.6\";s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:41:\"amazon-s3-and-cloudfront/wordpress-s3.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:38:\"w.org/plugins/amazon-s3-and-cloudfront\";s:4:\"slug\";s:24:\"amazon-s3-and-cloudfront\";s:6:\"plugin\";s:41:\"amazon-s3-and-cloudfront/wordpress-s3.php\";s:11:\"new_version\";s:5:\"2.1.1\";s:3:\"url\";s:55:\"https://wordpress.org/plugins/amazon-s3-and-cloudfront/\";s:7:\"package\";s:73:\"https://downloads.wordpress.org/plugin/amazon-s3-and-cloudfront.2.1.1.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:77:\"https://ps.w.org/amazon-s3-and-cloudfront/assets/icon-256x256.jpg?rev=1809890\";s:2:\"1x\";s:77:\"https://ps.w.org/amazon-s3-and-cloudfront/assets/icon-128x128.jpg?rev=1809890\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:80:\"https://ps.w.org/amazon-s3-and-cloudfront/assets/banner-1544x500.jpg?rev=1809890\";s:2:\"1x\";s:79:\"https://ps.w.org/amazon-s3-and-cloudfront/assets/banner-772x250.jpg?rev=1809890\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:3:\"5.2\";s:12:\"requires_php\";s:3:\"5.5\";s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:27:\"wp-super-cache/wp-cache.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:28:\"w.org/plugins/wp-super-cache\";s:4:\"slug\";s:14:\"wp-super-cache\";s:6:\"plugin\";s:27:\"wp-super-cache/wp-cache.php\";s:11:\"new_version\";s:5:\"1.6.5\";s:3:\"url\";s:45:\"https://wordpress.org/plugins/wp-super-cache/\";s:7:\"package\";s:63:\"https://downloads.wordpress.org/plugin/wp-super-cache.1.6.5.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:67:\"https://ps.w.org/wp-super-cache/assets/icon-256x256.png?rev=1095422\";s:2:\"1x\";s:67:\"https://ps.w.org/wp-super-cache/assets/icon-128x128.png?rev=1095422\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:70:\"https://ps.w.org/wp-super-cache/assets/banner-1544x500.png?rev=1082414\";s:2:\"1x\";s:69:\"https://ps.w.org/wp-super-cache/assets/banner-772x250.png?rev=1082414\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";s:5:\"5.2.4\";s:13:\"compatibility\";O:8:\"stdClass\":0:{}}s:24:\"wordpress-seo/wp-seo.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:27:\"w.org/plugins/wordpress-seo\";s:4:\"slug\";s:13:\"wordpress-seo\";s:6:\"plugin\";s:24:\"wordpress-seo/wp-seo.php\";s:11:\"new_version\";s:6:\"11.1.1\";s:3:\"url\";s:44:\"https://wordpress.org/plugins/wordpress-seo/\";s:7:\"package\";s:63:\"https://downloads.wordpress.org/plugin/wordpress-seo.11.1.1.zip\";s:5:\"icons\";a:3:{s:2:\"2x\";s:66:\"https://ps.w.org/wordpress-seo/assets/icon-256x256.png?rev=1834347\";s:2:\"1x\";s:58:\"https://ps.w.org/wordpress-seo/assets/icon.svg?rev=1946641\";s:3:\"svg\";s:58:\"https://ps.w.org/wordpress-seo/assets/icon.svg?rev=1946641\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:69:\"https://ps.w.org/wordpress-seo/assets/banner-1544x500.png?rev=1843435\";s:2:\"1x\";s:68:\"https://ps.w.org/wordpress-seo/assets/banner-772x250.png?rev=1843435\";}s:11:\"banners_rtl\";a:2:{s:2:\"2x\";s:73:\"https://ps.w.org/wordpress-seo/assets/banner-1544x500-rtl.png?rev=1843435\";s:2:\"1x\";s:72:\"https://ps.w.org/wordpress-seo/assets/banner-772x250-rtl.png?rev=1843435\";}s:6:\"tested\";s:3:\"5.2\";s:12:\"requires_php\";s:5:\"5.2.4\";s:13:\"compatibility\";O:8:\"stdClass\":0:{}}}s:12:\"translations\";a:0:{}s:9:\"no_update\";a:9:{s:15:\"brizy/brizy.php\";O:8:\"stdClass\":9:{s:2:\"id\";s:19:\"w.org/plugins/brizy\";s:4:\"slug\";s:5:\"brizy\";s:6:\"plugin\";s:15:\"brizy/brizy.php\";s:11:\"new_version\";s:6:\"1.0.74\";s:3:\"url\";s:36:\"https://wordpress.org/plugins/brizy/\";s:7:\"package\";s:55:\"https://downloads.wordpress.org/plugin/brizy.1.0.74.zip\";s:5:\"icons\";a:3:{s:2:\"2x\";s:58:\"https://ps.w.org/brizy/assets/icon-256x256.jpg?rev=1857924\";s:2:\"1x\";s:50:\"https://ps.w.org/brizy/assets/icon.svg?rev=1857924\";s:3:\"svg\";s:50:\"https://ps.w.org/brizy/assets/icon.svg?rev=1857924\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:61:\"https://ps.w.org/brizy/assets/banner-1544x500.jpg?rev=1857924\";s:2:\"1x\";s:60:\"https://ps.w.org/brizy/assets/banner-772x250.jpg?rev=1857924\";}s:11:\"banners_rtl\";a:0:{}}s:33:\"classic-editor/classic-editor.php\";O:8:\"stdClass\":9:{s:2:\"id\";s:28:\"w.org/plugins/classic-editor\";s:4:\"slug\";s:14:\"classic-editor\";s:6:\"plugin\";s:33:\"classic-editor/classic-editor.php\";s:11:\"new_version\";s:3:\"1.4\";s:3:\"url\";s:45:\"https://wordpress.org/plugins/classic-editor/\";s:7:\"package\";s:61:\"https://downloads.wordpress.org/plugin/classic-editor.1.4.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:67:\"https://ps.w.org/classic-editor/assets/icon-256x256.png?rev=1998671\";s:2:\"1x\";s:67:\"https://ps.w.org/classic-editor/assets/icon-128x128.png?rev=1998671\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:70:\"https://ps.w.org/classic-editor/assets/banner-1544x500.png?rev=1998671\";s:2:\"1x\";s:69:\"https://ps.w.org/classic-editor/assets/banner-772x250.png?rev=1998676\";}s:11:\"banners_rtl\";a:0:{}}s:55:\"fly-dynamic-image-resizer/fly-dynamic-image-resizer.php\";O:8:\"stdClass\":9:{s:2:\"id\";s:39:\"w.org/plugins/fly-dynamic-image-resizer\";s:4:\"slug\";s:25:\"fly-dynamic-image-resizer\";s:6:\"plugin\";s:55:\"fly-dynamic-image-resizer/fly-dynamic-image-resizer.php\";s:11:\"new_version\";s:5:\"2.0.5\";s:3:\"url\";s:56:\"https://wordpress.org/plugins/fly-dynamic-image-resizer/\";s:7:\"package\";s:74:\"https://downloads.wordpress.org/plugin/fly-dynamic-image-resizer.2.0.5.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:78:\"https://ps.w.org/fly-dynamic-image-resizer/assets/icon-256x256.png?rev=1256617\";s:2:\"1x\";s:78:\"https://ps.w.org/fly-dynamic-image-resizer/assets/icon-256x256.png?rev=1256617\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:81:\"https://ps.w.org/fly-dynamic-image-resizer/assets/banner-1544x500.png?rev=1256606\";s:2:\"1x\";s:80:\"https://ps.w.org/fly-dynamic-image-resizer/assets/banner-772x250.png?rev=1256606\";}s:11:\"banners_rtl\";a:0:{}}s:23:\"gutenberg/gutenberg.php\";O:8:\"stdClass\":12:{s:2:\"id\";s:23:\"w.org/plugins/gutenberg\";s:4:\"slug\";s:9:\"gutenberg\";s:6:\"plugin\";s:23:\"gutenberg/gutenberg.php\";s:11:\"new_version\";s:5:\"5.6.1\";s:3:\"url\";s:40:\"https://wordpress.org/plugins/gutenberg/\";s:7:\"package\";s:58:\"https://downloads.wordpress.org/plugin/gutenberg.5.6.1.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:62:\"https://ps.w.org/gutenberg/assets/icon-256x256.jpg?rev=1776042\";s:2:\"1x\";s:62:\"https://ps.w.org/gutenberg/assets/icon-128x128.jpg?rev=1776042\";}s:7:\"banners\";a:2:{s:2:\"2x\";s:65:\"https://ps.w.org/gutenberg/assets/banner-1544x500.jpg?rev=1718710\";s:2:\"1x\";s:64:\"https://ps.w.org/gutenberg/assets/banner-772x250.jpg?rev=1718710\";}s:11:\"banners_rtl\";a:0:{}s:6:\"tested\";s:5:\"5.1.1\";s:12:\"requires_php\";b:0;s:13:\"compatibility\";a:0:{}}s:9:\"hello.php\";O:8:\"stdClass\":9:{s:2:\"id\";s:25:\"w.org/plugins/hello-dolly\";s:4:\"slug\";s:11:\"hello-dolly\";s:6:\"plugin\";s:9:\"hello.php\";s:11:\"new_version\";s:3:\"1.6\";s:3:\"url\";s:42:\"https://wordpress.org/plugins/hello-dolly/\";s:7:\"package\";s:58:\"https://downloads.wordpress.org/plugin/hello-dolly.1.6.zip\";s:5:\"icons\";a:2:{s:2:\"2x\";s:64:\"https://ps.w.org/hello-dolly/assets/icon-256x256.jpg?rev=2052855\";s:2:\"1x\";s:64:\"https://ps.w.org/hello-dolly/assets/icon-128x128.jpg?rev=2052855\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:66:\"https://ps.w.org/hello-dolly/assets/banner-772x250.jpg?rev=2052855\";}s:11:\"banners_rtl\";a:0:{}}s:48:\"woocommerce-social-media-share-buttons/index.php\";O:8:\"stdClass\":9:{s:2:\"id\";s:52:\"w.org/plugins/woocommerce-social-media-share-buttons\";s:4:\"slug\";s:38:\"woocommerce-social-media-share-buttons\";s:6:\"plugin\";s:48:\"woocommerce-social-media-share-buttons/index.php\";s:11:\"new_version\";s:5:\"1.3.0\";s:3:\"url\";s:69:\"https://wordpress.org/plugins/woocommerce-social-media-share-buttons/\";s:7:\"package\";s:81:\"https://downloads.wordpress.org/plugin/woocommerce-social-media-share-buttons.zip\";s:5:\"icons\";a:1:{s:2:\"1x\";s:91:\"https://ps.w.org/woocommerce-social-media-share-buttons/assets/icon-128x128.png?rev=1175698\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:93:\"https://ps.w.org/woocommerce-social-media-share-buttons/assets/banner-772x250.png?rev=1175683\";}s:11:\"banners_rtl\";a:0:{}}s:35:\"wordpress-https/wordpress-https.php\";O:8:\"stdClass\":9:{s:2:\"id\";s:29:\"w.org/plugins/wordpress-https\";s:4:\"slug\";s:15:\"wordpress-https\";s:6:\"plugin\";s:35:\"wordpress-https/wordpress-https.php\";s:11:\"new_version\";s:5:\"3.4.0\";s:3:\"url\";s:46:\"https://wordpress.org/plugins/wordpress-https/\";s:7:\"package\";s:64:\"https://downloads.wordpress.org/plugin/wordpress-https.3.4.0.zip\";s:5:\"icons\";a:1:{s:7:\"default\";s:66:\"https://s.w.org/plugins/geopattern-icon/wordpress-https_bec2c9.svg\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:69:\"https://ps.w.org/wordpress-https/assets/banner-772x250.png?rev=533268\";}s:11:\"banners_rtl\";a:0:{}}s:41:\"wordpress-importer/wordpress-importer.php\";O:8:\"stdClass\":9:{s:2:\"id\";s:32:\"w.org/plugins/wordpress-importer\";s:4:\"slug\";s:18:\"wordpress-importer\";s:6:\"plugin\";s:41:\"wordpress-importer/wordpress-importer.php\";s:11:\"new_version\";s:5:\"0.6.4\";s:3:\"url\";s:49:\"https://wordpress.org/plugins/wordpress-importer/\";s:7:\"package\";s:67:\"https://downloads.wordpress.org/plugin/wordpress-importer.0.6.4.zip\";s:5:\"icons\";a:3:{s:2:\"2x\";s:71:\"https://ps.w.org/wordpress-importer/assets/icon-256x256.png?rev=1908375\";s:2:\"1x\";s:63:\"https://ps.w.org/wordpress-importer/assets/icon.svg?rev=1908375\";s:3:\"svg\";s:63:\"https://ps.w.org/wordpress-importer/assets/icon.svg?rev=1908375\";}s:7:\"banners\";a:1:{s:2:\"1x\";s:72:\"https://ps.w.org/wordpress-importer/assets/banner-772x250.png?rev=547654\";}s:11:\"banners_rtl\";a:0:{}}s:45:\"wp-widgets-shortcode/wp-widgets-shortcode.php\";O:8:\"stdClass\":9:{s:2:\"id\";s:34:\"w.org/plugins/wp-widgets-shortcode\";s:4:\"slug\";s:20:\"wp-widgets-shortcode\";s:6:\"plugin\";s:45:\"wp-widgets-shortcode/wp-widgets-shortcode.php\";s:11:\"new_version\";s:5:\"1.0.3\";s:3:\"url\";s:51:\"https://wordpress.org/plugins/wp-widgets-shortcode/\";s:7:\"package\";s:69:\"https://downloads.wordpress.org/plugin/wp-widgets-shortcode.1.0.3.zip\";s:5:\"icons\";a:1:{s:7:\"default\";s:64:\"https://s.w.org/plugins/geopattern-icon/wp-widgets-shortcode.svg\";}s:7:\"banners\";a:0:{}s:11:\"banners_rtl\";a:0:{}}}}',
        'no'),
       (125, 'auto_core_update_failed',
        'a:6:{s:9:\"attempted\";s:5:\"5.0.4\";s:7:\"current\";s:9:\"5.0-beta5\";s:10:\"error_code\";s:32:\"copy_failed_for_update_core_file\";s:10:\"error_data\";s:33:\"wp-admin/includes/update-core.php\";s:9:\"timestamp\";i:1557306000;s:5:\"retry\";b:0;}',
        'no'),
       (126, 'auto_core_update_notified',
        'a:4:{s:4:\"type\";s:4:\"fail\";s:5:\"email\";s:23:\"alecszaharia@brizy.loca\";s:7:\"version\";s:5:\"5.0.4\";s:9:\"timestamp\";i:1557306000;}',
        'no');
/*!40000 ALTER TABLE `wp_options`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wp_postmeta`
--

DROP TABLE IF EXISTS `wp_postmeta`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_postmeta`
(
    `meta_id`    bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `post_id`    bigint(20) unsigned NOT NULL                DEFAULT '0',
    `meta_key`   varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
    `meta_value` longtext COLLATE utf8mb4_unicode_520_ci,
    PRIMARY KEY (`meta_id`),
    KEY `post_id` (`post_id`),
    KEY `meta_key` (`meta_key`(191))
) ENGINE = InnoDB
  AUTO_INCREMENT = 3
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_postmeta`
--

LOCK TABLES `wp_postmeta` WRITE;
/*!40000 ALTER TABLE `wp_postmeta`
    DISABLE KEYS */;
INSERT INTO `wp_postmeta`
VALUES (1, 2, '_wp_page_template', 'default'),
       (2, 3, '_wp_page_template', 'default');
/*!40000 ALTER TABLE `wp_postmeta`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wp_posts`
--

DROP TABLE IF EXISTS `wp_posts`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_posts`
(
    `ID`                    bigint(20) unsigned                         NOT NULL AUTO_INCREMENT,
    `post_author`           bigint(20) unsigned                         NOT NULL DEFAULT '0',
    `post_date`             datetime                                    NOT NULL DEFAULT '0000-00-00 00:00:00',
    `post_date_gmt`         datetime                                    NOT NULL DEFAULT '0000-00-00 00:00:00',
    `post_content`          longtext COLLATE utf8mb4_unicode_520_ci     NOT NULL,
    `post_title`            text COLLATE utf8mb4_unicode_520_ci         NOT NULL,
    `post_excerpt`          text COLLATE utf8mb4_unicode_520_ci         NOT NULL,
    `post_status`           varchar(20) COLLATE utf8mb4_unicode_520_ci  NOT NULL DEFAULT 'publish',
    `comment_status`        varchar(20) COLLATE utf8mb4_unicode_520_ci  NOT NULL DEFAULT 'open',
    `ping_status`           varchar(20) COLLATE utf8mb4_unicode_520_ci  NOT NULL DEFAULT 'open',
    `post_password`         varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `post_name`             varchar(200) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `to_ping`               text COLLATE utf8mb4_unicode_520_ci         NOT NULL,
    `pinged`                text COLLATE utf8mb4_unicode_520_ci         NOT NULL,
    `post_modified`         datetime                                    NOT NULL DEFAULT '0000-00-00 00:00:00',
    `post_modified_gmt`     datetime                                    NOT NULL DEFAULT '0000-00-00 00:00:00',
    `post_content_filtered` longtext COLLATE utf8mb4_unicode_520_ci     NOT NULL,
    `post_parent`           bigint(20) unsigned                         NOT NULL DEFAULT '0',
    `guid`                  varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `menu_order`            int(11)                                     NOT NULL DEFAULT '0',
    `post_type`             varchar(20) COLLATE utf8mb4_unicode_520_ci  NOT NULL DEFAULT 'post',
    `post_mime_type`        varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `comment_count`         bigint(20)                                  NOT NULL DEFAULT '0',
    PRIMARY KEY (`ID`),
    KEY `post_name` (`post_name`(191)),
    KEY `type_status_date` (`post_type`, `post_status`, `post_date`, `ID`),
    KEY `post_parent` (`post_parent`),
    KEY `post_author` (`post_author`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 4
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_posts`
--

LOCK TABLES `wp_posts` WRITE;
/*!40000 ALTER TABLE `wp_posts`
    DISABLE KEYS */;
INSERT INTO `wp_posts`
VALUES (1, 1, '2019-05-08 08:59:32', '2019-05-08 08:59:32',
        '<!-- wp:paragraph -->\n<p>Welcome to WordPress. This is your first post. Edit or delete it, then start writing!</p>\n<!-- /wp:paragraph -->',
        'Hello world!', '', 'publish', 'open', 'open', '', 'hello-world', '', '', '2019-05-08 08:59:32',
        '2019-05-08 08:59:32', '', 0, 'http://brizy.local/?p=1', 0, 'post', '', 1),
       (2, 1, '2019-05-08 08:59:32', '2019-05-08 08:59:32',
        '<!-- wp:paragraph -->\n<p>This is an example page. It\'s different from a blog post because it will stay in one place and will show up in your site navigation (in most themes). Most people start with an About page that introduces them to potential site visitors. It might say something like this:</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:quote -->\n<blockquote class=\"wp-block-quote\"><p>Hi there! I\'m a bike messenger by day, aspiring actor by night, and this is my website. I live in Los Angeles, have a great dog named Jack, and I like pi&#241;a coladas. (And gettin\' caught in the rain.)</p></blockquote>\n<!-- /wp:quote -->\n\n<!-- wp:paragraph -->\n<p>...or something like this:</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:quote -->\n<blockquote class=\"wp-block-quote\"><p>The XYZ Doohickey Company was founded in 1971, and has been providing quality doohickeys to the public ever since. Located in Gotham City, XYZ employs over 2,000 people and does all kinds of awesome things for the Gotham community.</p></blockquote>\n<!-- /wp:quote -->\n\n<!-- wp:paragraph -->\n<p>As a new WordPress user, you should go to <a href=\"http://brizy.local/wp-admin/\">your dashboard</a> to delete this page and create new pages for your content. Have fun!</p>\n<!-- /wp:paragraph -->',
        'Sample Page', '', 'publish', 'closed', 'open', '', 'sample-page', '', '', '2019-05-08 08:59:32',
        '2019-05-08 08:59:32', '', 0, 'http://brizy.local/?page_id=2', 0, 'page', '', 0),
       (3, 1, '2019-05-08 08:59:32', '2019-05-08 08:59:32',
        '<!-- wp:heading --><h2>Who we are</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Our website address is: http://brizy.local.</p><!-- /wp:paragraph --><!-- wp:heading --><h2>What personal data we collect and why we collect it</h2><!-- /wp:heading --><!-- wp:heading {\"level\":3} --><h3>Comments</h3><!-- /wp:heading --><!-- wp:paragraph --><p>When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor&#8217;s IP address and browser user agent string to help spam detection.</p><!-- /wp:paragraph --><!-- wp:paragraph --><p>An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.</p><!-- /wp:paragraph --><!-- wp:heading {\"level\":3} --><h3>Media</h3><!-- /wp:heading --><!-- wp:paragraph --><p>If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.</p><!-- /wp:paragraph --><!-- wp:heading {\"level\":3} --><h3>Contact forms</h3><!-- /wp:heading --><!-- wp:heading {\"level\":3} --><h3>Cookies</h3><!-- /wp:heading --><!-- wp:paragraph --><p>If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.</p><!-- /wp:paragraph --><!-- wp:paragraph --><p>If you have an account and you log in to this site, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.</p><!-- /wp:paragraph --><!-- wp:paragraph --><p>When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select &quot;Remember Me&quot;, your login will persist for two weeks. If you log out of your account, the login cookies will be removed.</p><!-- /wp:paragraph --><!-- wp:paragraph --><p>If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.</p><!-- /wp:paragraph --><!-- wp:heading {\"level\":3} --><h3>Embedded content from other websites</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.</p><!-- /wp:paragraph --><!-- wp:paragraph --><p>These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.</p><!-- /wp:paragraph --><!-- wp:heading {\"level\":3} --><h3>Analytics</h3><!-- /wp:heading --><!-- wp:heading --><h2>Who we share your data with</h2><!-- /wp:heading --><!-- wp:heading --><h2>How long we retain your data</h2><!-- /wp:heading --><!-- wp:paragraph --><p>If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.</p><!-- /wp:paragraph --><!-- wp:paragraph --><p>For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.</p><!-- /wp:paragraph --><!-- wp:heading --><h2>What rights you have over your data</h2><!-- /wp:heading --><!-- wp:paragraph --><p>If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.</p><!-- /wp:paragraph --><!-- wp:heading --><h2>Where we send your data</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Visitor comments may be checked through an automated spam detection service.</p><!-- /wp:paragraph --><!-- wp:heading --><h2>Your contact information</h2><!-- /wp:heading --><!-- wp:heading --><h2>Additional information</h2><!-- /wp:heading --><!-- wp:heading {\"level\":3} --><h3>How we protect your data</h3><!-- /wp:heading --><!-- wp:heading {\"level\":3} --><h3>What data breach procedures we have in place</h3><!-- /wp:heading --><!-- wp:heading {\"level\":3} --><h3>What third parties we receive data from</h3><!-- /wp:heading --><!-- wp:heading {\"level\":3} --><h3>What automated decision making and/or profiling we do with user data</h3><!-- /wp:heading --><!-- wp:heading {\"level\":3} --><h3>Industry regulatory disclosure requirements</h3><!-- /wp:heading -->',
        'Privacy Policy', '', 'draft', 'closed', 'open', '', 'privacy-policy', '', '', '2019-05-08 08:59:32',
        '2019-05-08 08:59:32', '', 0, 'http://brizy.local/?page_id=3', 0, 'page', '', 0);
/*!40000 ALTER TABLE `wp_posts`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wp_term_relationships`
--

DROP TABLE IF EXISTS `wp_term_relationships`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_term_relationships`
(
    `object_id`        bigint(20) unsigned NOT NULL DEFAULT '0',
    `term_taxonomy_id` bigint(20) unsigned NOT NULL DEFAULT '0',
    `term_order`       int(11)             NOT NULL DEFAULT '0',
    PRIMARY KEY (`object_id`, `term_taxonomy_id`),
    KEY `term_taxonomy_id` (`term_taxonomy_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_term_relationships`
--

LOCK TABLES `wp_term_relationships` WRITE;
/*!40000 ALTER TABLE `wp_term_relationships`
    DISABLE KEYS */;
INSERT INTO `wp_term_relationships`
VALUES (1, 1, 0);
/*!40000 ALTER TABLE `wp_term_relationships`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wp_term_taxonomy`
--

DROP TABLE IF EXISTS `wp_term_taxonomy`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_term_taxonomy`
(
    `term_taxonomy_id` bigint(20) unsigned                        NOT NULL AUTO_INCREMENT,
    `term_id`          bigint(20) unsigned                        NOT NULL DEFAULT '0',
    `taxonomy`         varchar(32) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `description`      longtext COLLATE utf8mb4_unicode_520_ci    NOT NULL,
    `parent`           bigint(20) unsigned                        NOT NULL DEFAULT '0',
    `count`            bigint(20)                                 NOT NULL DEFAULT '0',
    PRIMARY KEY (`term_taxonomy_id`),
    UNIQUE KEY `term_id_taxonomy` (`term_id`, `taxonomy`),
    KEY `taxonomy` (`taxonomy`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 2
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_term_taxonomy`
--

LOCK TABLES `wp_term_taxonomy` WRITE;
/*!40000 ALTER TABLE `wp_term_taxonomy`
    DISABLE KEYS */;
INSERT INTO `wp_term_taxonomy`
VALUES (1, 1, 'category', '', 0, 1);
/*!40000 ALTER TABLE `wp_term_taxonomy`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wp_termmeta`
--

DROP TABLE IF EXISTS `wp_termmeta`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_termmeta`
(
    `meta_id`    bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `term_id`    bigint(20) unsigned NOT NULL                DEFAULT '0',
    `meta_key`   varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
    `meta_value` longtext COLLATE utf8mb4_unicode_520_ci,
    PRIMARY KEY (`meta_id`),
    KEY `term_id` (`term_id`),
    KEY `meta_key` (`meta_key`(191))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_termmeta`
--
--
-- Table structure for table `wp_terms`
--

DROP TABLE IF EXISTS `wp_terms`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_terms`
(
    `term_id`    bigint(20) unsigned                         NOT NULL AUTO_INCREMENT,
    `name`       varchar(200) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `slug`       varchar(200) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `term_group` bigint(10)                                  NOT NULL DEFAULT '0',
    PRIMARY KEY (`term_id`),
    KEY `slug` (`slug`(191)),
    KEY `name` (`name`(191))
) ENGINE = InnoDB
  AUTO_INCREMENT = 2
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_terms`
--

LOCK TABLES `wp_terms` WRITE;
/*!40000 ALTER TABLE `wp_terms`
    DISABLE KEYS */;
INSERT INTO `wp_terms`
VALUES (1, 'Uncategorized', 'uncategorized', 0);
/*!40000 ALTER TABLE `wp_terms`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wp_usermeta`
--

DROP TABLE IF EXISTS `wp_usermeta`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_usermeta`
(
    `umeta_id`   bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `user_id`    bigint(20) unsigned NOT NULL                DEFAULT '0',
    `meta_key`   varchar(255) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
    `meta_value` longtext COLLATE utf8mb4_unicode_520_ci,
    PRIMARY KEY (`umeta_id`),
    KEY `user_id` (`user_id`),
    KEY `meta_key` (`meta_key`(191))
) ENGINE = InnoDB
  AUTO_INCREMENT = 16
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_usermeta`
--

LOCK TABLES `wp_usermeta` WRITE;
/*!40000 ALTER TABLE `wp_usermeta`
    DISABLE KEYS */;
INSERT INTO `wp_usermeta`
VALUES (1, 1, 'nickname', 'admin'),
       (2, 1, 'first_name', ''),
       (3, 1, 'last_name', ''),
       (4, 1, 'description', ''),
       (5, 1, 'rich_editing', 'true'),
       (6, 1, 'syntax_highlighting', 'true'),
       (7, 1, 'comment_shortcuts', 'false'),
       (8, 1, 'admin_color', 'fresh'),
       (9, 1, 'use_ssl', '0'),
       (10, 1, 'show_admin_bar_front', 'true'),
       (11, 1, 'locale', ''),
       (12, 1, 'wp_capabilities', 'a:1:{s:13:\"administrator\";b:1;}'),
       (13, 1, 'wp_user_level', '10'),
       (14, 1, 'dismissed_wp_pointers', 'wp496_privacy'),
       (15, 1, 'show_welcome_panel', '1');
/*!40000 ALTER TABLE `wp_usermeta`
    ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wp_users`
--

DROP TABLE IF EXISTS `wp_users`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wp_users`
(
    `ID`                  bigint(20) unsigned                         NOT NULL AUTO_INCREMENT,
    `user_login`          varchar(60) COLLATE utf8mb4_unicode_520_ci  NOT NULL DEFAULT '',
    `user_pass`           varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `user_nicename`       varchar(50) COLLATE utf8mb4_unicode_520_ci  NOT NULL DEFAULT '',
    `user_email`          varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `user_url`            varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `user_registered`     datetime                                    NOT NULL DEFAULT '0000-00-00 00:00:00',
    `user_activation_key` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    `user_status`         int(11)                                     NOT NULL DEFAULT '0',
    `display_name`        varchar(250) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '',
    PRIMARY KEY (`ID`),
    KEY `user_login_key` (`user_login`),
    KEY `user_nicename` (`user_nicename`),
    KEY `user_email` (`user_email`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 2
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wp_users`
--

LOCK TABLES `wp_users` WRITE;
/*!40000 ALTER TABLE `wp_users`
    DISABLE KEYS */;
INSERT INTO `wp_users`
VALUES (1, 'admin', '$P$BhxY7vXA4onI01GPbRrSx1evrL7m/b1', 'admin', 'alecszaharia@brizy.loca', '', '2019-05-08 08:59:32',
        '', 0, 'admin');
/*!40000 ALTER TABLE `wp_users`
    ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE = @OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE = @OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES = @OLD_SQL_NOTES */;

-- Dump completed on 2019-05-08 12:03:13
