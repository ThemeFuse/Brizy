<?php

class Brizy_Admin_Symbols_Autosave
{
    /**
     * Create or update the per-user autosave revision for a symbol.
     *
     * Stores the symbol payload as a WP `revision` row attached to the live
     * symbol post. Uses the same `{parentId}-autosave-{userId}` naming WP
     * uses for native autosaves, so per-user lookup matches the existing
     * Brizy_Editor_AutoSaveAware semantics.
     *
     * Enforces the same optimistic version check as Brizy_Admin_Symbols_Manager::saveAllSymbols
     * (currentVersion + 1 === requestVersion); a stale base version hard-rejects.
     *
     * @param Brizy_Admin_Symbols_Symbol $symbol
     * @param int                        $userId
     *
     * @return int Revision post ID
     * @throws Exception
     */
    public function save($symbol, $userId)
    {
        global $wpdb;

        $liveId = (int)$symbol->getId();
        if (!$liveId) {
            throw new Exception('Cannot autosave a symbol that does not exist');
        }

        $locked = $wpdb->get_row($wpdb->prepare(
            "SELECT post_content FROM $wpdb->posts WHERE ID=%d AND post_type=%s FOR UPDATE",
            $liveId,
            Brizy_Admin_Symbols_Main::CP_SYMBOL
        ));
        if (!$locked) {
            throw new Exception('Symbol no longer exists: ' . $symbol->getUid());
        }
        $currentJson = json_decode(base64_decode($locked->post_content));
        $currentVersion = isset($currentJson->version) ? (int)$currentJson->version : 0;
        if ($currentVersion + 1 !== (int)$symbol->getVersion()) {
            throw new Exception('Invalid symbol version. Please refresh and try again.');
        }

        // ID must be the live post's ID — _wp_post_revision_data reads $post['ID']
        // to set the revision's post_parent and post_name ("{ID}-autosave-v1").
        $post_data = array(
            'ID'           => $liveId,
            'post_type'    => Brizy_Admin_Symbols_Main::CP_SYMBOL,
            'post_title'   => $symbol->getLabel(),
            'post_excerpt' => $symbol->getUid(),
            'post_content' => base64_encode(json_encode($symbol->convertToSaveValue())),
            'post_author'  => (int)$userId,
        );

        $oldAutosaveId = $this->getLastFor($liveId, (int)$userId);

        if ($oldAutosaveId) {
            $new_autosave               = _wp_post_revision_data($post_data, true);
            $new_autosave['ID']         = $oldAutosaveId;
            $new_autosave['post_author'] = (int)$userId;

            do_action('wp_creating_autosave', $new_autosave);

            $result = wp_update_post(wp_slash($new_autosave));
            if (is_wp_error($result)) {
                throw new Exception('Unable to update autosave for symbol ' . $symbol->getUid());
            }

            return (int)$oldAutosaveId;
        }

        $revId = _wp_put_post_revision($post_data, true);
        if (is_wp_error($revId) || !$revId) {
            throw new Exception('Unable to create autosave for symbol ' . $symbol->getUid());
        }

        return (int)$revId;
    }

    /**
     * Fetch the per-user autosave for a live symbol, hydrated as a Symbol entity.
     *
     * @param int $liveId
     * @param int $userId
     *
     * @return Brizy_Admin_Symbols_Symbol|null
     * @throws Exception
     */
    public function getFor($liveId, $userId)
    {
        $autosaveId = $this->getLastFor((int)$liveId, (int)$userId);
        if (!$autosaveId) {
            return null;
        }

        $row = get_post($autosaveId);
        if (!$row) {
            return null;
        }

        $jsonObj = json_decode(base64_decode($row->post_content));
        if (!$jsonObj) {
            return null;
        }

        // Don't overwrite status from the revision row — revisions are always
        // 'inherit'. The autosaved JSON payload already carries the user-intended
        // status (publish/draft) via createFromJsonObject.
        $symbol = Brizy_Admin_Symbols_Symbol::createFromJsonObject($jsonObj, (int)$liveId);

        return $symbol;
    }

    /**
     * Delete autosave revisions for a live symbol.
     *
     * When $userId is null, deletes every user's autosaves of this symbol —
     * used after a successful publish where the live row is now canonical.
     *
     * @param int      $liveId
     * @param int|null $userId
     *
     * @return void
     */
    public function deleteOldFor($liveId, $userId = null)
    {
        global $wpdb;

        $liveId = (int)$liveId;
        $like   = $wpdb->esc_like($liveId . '-autosave') . '%';

        if (is_null($userId)) {
            $wpdb->query($wpdb->prepare(
                "DELETE p, pm FROM {$wpdb->posts} p
                 LEFT JOIN {$wpdb->postmeta} pm ON pm.post_id = p.ID
                 WHERE p.post_parent = %d
                   AND p.post_type = 'revision'
                   AND p.post_name LIKE %s",
                $liveId,
                $like
            ));

            return;
        }

        $wpdb->query($wpdb->prepare(
            "DELETE p, pm FROM {$wpdb->posts} p
             LEFT JOIN {$wpdb->postmeta} pm ON pm.post_id = p.ID
             WHERE p.post_author = %d
               AND p.post_parent = %d
               AND p.post_type = 'revision'
               AND p.post_name LIKE %s",
            (int)$userId,
            $liveId,
            $like
        ));
    }

    /**
     * @param int $liveId
     * @param int $userId
     *
     * @return int Autosave revision post ID, or 0 if none.
     */
    private function getLastFor($liveId, $userId)
    {
        global $wpdb;

        $liveId = (int)$liveId;
        $userId = (int)$userId;
        $like   = $wpdb->esc_like($liveId . '-autosave') . '%';

        return (int)$wpdb->get_var($wpdb->prepare(
            "SELECT ID FROM {$wpdb->posts}
             WHERE post_parent = %d
               AND post_type = 'revision'
               AND post_status = 'inherit'
               AND post_name LIKE %s
               AND post_author = %d
             ORDER BY post_date DESC
             LIMIT 1",
            $liveId,
            $like,
            $userId
        ));
    }
}
