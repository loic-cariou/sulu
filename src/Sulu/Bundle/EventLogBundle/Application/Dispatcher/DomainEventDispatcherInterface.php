<?php

/*
 * This file is part of Sulu.
 *
 * (c) Sulu GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\EventLogBundle\Application\Dispatcher;

use Sulu\Bundle\EventLogBundle\Domain\Event\DomainEvent;

interface DomainEventDispatcherInterface
{
    public function dispatch(DomainEvent $event): DomainEvent;
}
