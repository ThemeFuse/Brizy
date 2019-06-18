<?php

class Brizy_ThirdParty_Comments_Main {
  public static function init() {
    add_filter('brizy_third-party_elements', 'Brizy_ThirdParty_Comments_Main::register_element');
    add_action('brizy_editor_enqueue_scripts', 'Brizy_ThirdParty_Comments_Main::enqueue_toolbar_js');
  }

  public static function enqueue_toolbar_js() {
    wp_enqueue_script(
      'brizy-tp-latest-comments',
      plugins_url('toolbar.js', __FILE__),
      array('brizy-editor'),
      null,
      true
    );
  }


  public static function register_element($elements) {
    $elements[] = array(
      'id'                 => 'Comments',
      'title'              => 'Comments',
      'icon'               => 'nc-save-section',
      'html'               => self::get_html(),
      'css'                => self::get_css(),
      'defaultValue'       => array(
        'avatarSize'       => '48',
        'avatarRadius'     => 'rounded',
        'avatarSpacing'    => '10',
        'contentColor'     => 'black',
        // 'numComments'      => '3'
      ),
      'dataApi'            => "Brizy_ThirdParty_Comments_Main::data_api",
      // 'dataApiKeys'        => array( 'numComments' )
    );

    return $elements;
  }

  public static function data_api($v, $context) {
    $is_editor = $context['is_editor'];

    if ($is_editor) {
      return self::data_api_editor($v, $context);
    } else {
      return self::data_api_preview($v, $context);
    }
  }

  public static function data_api_editor($v, $context) {
    return array(
      array(
        'comment_author' => "Example author 1",
        'comment_content' => "Example content 1",
        'comment_depth' => 0
      ),
      array(
        'comment_author' => "Example author 2",
        'comment_content' => "Example content 2",
        'comment_depth' => 1
      ),
      array(
        'comment_author' => "Example author 3",
        'comment_content' => "Example content 3",
        'comment_depth' => 2
      ),
      array(
        'comment_author' => "Example author 4",
        'comment_content' => "Example content 4",
        'comment_depth' => 0
      ),
    );
  }

  public static function data_api_preview($v, $context) {
    $comments = get_comments(array(
      'post_id' => 51,
      'order' => 'ASC'
    ));

    // prepare the data in such a way that will be 
    // comfortable for the view to render hierarchical data
    $keys = array();
    $ret  = array();
    foreach ($comments as $comment) {
      if (isset($keys[$comment->comment_parent])) {
        $keys[$comment->comment_ID] = "{$keys[$comment->comment_parent]}{$comment->comment_ID}";
      } else {
        $keys[$comment->comment_ID] = "{$comment->comment_parent}{$comment->comment_ID}";
      }

      $key = $keys[$comment->comment_ID];
      $ret[$key] = array(
        'comment_author' => $comment->comment_author,
        'comment_content' => $comment->comment_content,
        'comment_depth' => strlen($key) - 2
      );
    }

    uksort($ret, "strcmp");

    return array_values($ret);
  }

  private static function get_html() {
    ob_start();
    comment_form();
    $form = ob_get_contents();
    ob_end_clean();

    return '
<div class="tp-comments">
  {% set lastItemDepth = -1 %}
  {% for comment in apiData %}
    {% if comment.comment_depth > lastItemDepth %}
      <ul class="tp-comments-ul tp-comments-ul-depth-{{ comment.comment_depth }}">
    {% endif %}
    <li>
      <div class="tp-comment">
        <div class="tp-comment-content">
          <div class="tp-comment-author">{{ comment.comment_author }}</div>
          <div data-brz-toolbar="content" class="tp-comment-text">{{ comment.comment_content }}</div>
        </div>
      </div>
    </li>
    {% if comment.comment_depth > apiData[loop.index0 + 1].comment_depth %}
      {% for i in 0..(comment.comment_depth - apiData[loop.index0 + 1].comment_depth - 1) %}
      </ul>
      {% endfor %}
    {% endif %}
    {% if loop.last %}
      </ul>
    {% endif %}
    {% set lastItemDepth = comment.comment_depth %}
  {% endfor %}'
  . str_replace('<div id="respond"', '<div id="respond" data-brz-toolbar="content"', $form) . 
'</div>';
  }

  private static function get_css() {
    return '
& .tp-comments {
  background: white;
  color: {{ contentColor }};
}
& .tp-comments-ul {
  list-style: none;
  padding-left: 100px;
}
& .tp-comment {
  display: flex;
  width: 500px;
  padding: 10px;
  margin: 0 auto;
}
& .tp-comment-avatar {
  width: {{ avatarSize }}px;
  height: {{ avatarSize }}px;
  border-radius: {{ avatarRadius == "rounded" ? 50 : 0 }}%;
  margin-right: {{ avatarSpacing }}px;
}
& .tp-comment-author {
  font-weight: bold;
}';
  }

}