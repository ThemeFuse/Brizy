<?php

use BrizyPlaceholders\ContentPlaceholder;
use BrizyPlaceholders\ContextInterface;

class Brizy_Content_Placeholders_RecaptchaSiteKey extends Brizy_Content_Placeholders_Abstract
{
    public function support($placeholderName)
    {
        return 'recaptcha_site_key' === $placeholderName;
    }

    public function getValue(ContextInterface $context, ContentPlaceholder $contentPlaceholder)
    {
        $accountManager = new Brizy_Editor_Accounts_ServiceAccountManager(Brizy_Editor_Project::get());
        $accounts = $accountManager->getAccountsByGroup(Brizy_Editor_Accounts_AbstractAccount::RECAPTCHA_GROUP);

        $account = array_pop($accounts);

        if ($account) {
            return $account->getSiteKey();
        }

        return '';
    }

}
