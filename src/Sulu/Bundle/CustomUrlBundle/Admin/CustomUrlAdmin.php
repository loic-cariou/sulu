<?php

/*
 * This file is part of Sulu.
 *
 * (c) Sulu GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\CustomUrlBundle\Admin;

use Sulu\Bundle\AdminBundle\Admin\Admin;
use Sulu\Bundle\AdminBundle\Admin\View\ToolbarAction;
use Sulu\Bundle\AdminBundle\Admin\View\ViewBuilderFactoryInterface;
use Sulu\Bundle\AdminBundle\Admin\View\ViewCollection;
use Sulu\Bundle\PageBundle\Admin\PageAdmin;
use Sulu\Component\CustomUrl\Document\CustomUrlDocument;
use Sulu\Component\Security\Authorization\PermissionTypes;
use Sulu\Component\Security\Authorization\SecurityCheckerInterface;
use Sulu\Component\Webspace\Manager\WebspaceManagerInterface;
use Sulu\Component\Webspace\Webspace;

/**
 * Includes custom-url-bundle into sulu admin.
 */
class CustomUrlAdmin extends Admin
{
    /**
     * Returns security context for custom-urls in given webspace.
     *
     * @final
     *
     * @param string $webspaceKey
     *
     * @return string
     */
    public static function getCustomUrlSecurityContext($webspaceKey)
    {
        return \sprintf('%s%s.%s', PageAdmin::SECURITY_CONTEXT_PREFIX, $webspaceKey, 'custom-urls');
    }

    /**
     * @var WebspaceManagerInterface
     */
    private $webspaceManager;

    /**
     * @var ViewBuilderFactoryInterface
     */
    private $viewBuilderFactory;

    /**
     * @var SecurityCheckerInterface
     */
    private $securityChecker;

    public function __construct(
        WebspaceManagerInterface $webspaceManager,
        ViewBuilderFactoryInterface $viewBuilderFactory,
        SecurityCheckerInterface $securityChecker
    ) {
        $this->webspaceManager = $webspaceManager;
        $this->viewBuilderFactory = $viewBuilderFactory;
        $this->securityChecker = $securityChecker;
    }

    public function configureViews(ViewCollection $viewCollection): void
    {
        $listToolbarActions = [
            new ToolbarAction('sulu_admin.add'),
            new ToolbarAction('sulu_admin.delete'),
        ];

        if ($this->hasSomeWebspaceCustomUrlPermission()) {
            $viewCollection->add(
                $this->viewBuilderFactory
                    ->createFormOverlayListViewBuilder('sulu_custom_url.custom_urls_list', '/custom-urls')
                    ->setResourceKey(CustomUrlDocument::RESOURCE_KEY)
                    ->setListKey('custom_urls')
                    ->addListAdapters(['table_light'])
                    ->addRouterAttributesToListRequest(['webspace'])
                    ->addRouterAttributesToFormRequest(['webspace'])
                    ->disableSearching()
                    ->setFormKey('custom_url_details')
                    ->setTabTitle('sulu_custom_url.custom_urls')
                    ->addToolbarActions($listToolbarActions)
                    ->setTabOrder(1024)
                    ->setParent(PageAdmin::WEBSPACE_TABS_VIEW)
                    ->addRerenderAttribute('webspace')
            );
        }
    }

    public function getSecurityContexts()
    {
        $webspaceContexts = [];
        /* @var Webspace $webspace */
        foreach ($this->webspaceManager->getWebspaceCollection() as $webspace) {
            $securityContextKey = self::getCustomUrlSecurityContext($webspace->getKey());
            $webspaceContexts[$securityContextKey] = $this->getSecurityContextPermissions();
        }

        return [
            self::SULU_ADMIN_SECURITY_SYSTEM => [
                 'Webspaces' => $webspaceContexts,
             ],
         ];
    }

    public function getSecurityContextsWithPlaceholder()
    {
        return [
            self::SULU_ADMIN_SECURITY_SYSTEM => [
                'Webspaces' => [
                    self::getCustomUrlSecurityContext('#webspace#') => $this->getSecurityContextPermissions(),
                ],
            ],
        ];
    }

    private function getSecurityContextPermissions()
    {
        return [
            PermissionTypes::VIEW,
            PermissionTypes::ADD,
            PermissionTypes::EDIT,
            PermissionTypes::DELETE,
        ];
    }

    private function hasSomeWebspaceCustomUrlPermission(): bool
    {
        foreach ($this->webspaceManager->getWebspaceCollection()->getWebspaces() as $webspace) {
            $hasWebspaceAnalyticsPermission = $this->securityChecker->hasPermission(
                self::getCustomUrlSecurityContext($webspace->getKey()),
                PermissionTypes::EDIT
            );

            if ($hasWebspaceAnalyticsPermission) {
                return true;
            }
        }

        return false;
    }
}
