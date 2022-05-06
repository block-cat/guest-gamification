<?php

/*
 * This file is part of block-cat/guest-gamification.
 *
 * Copyright (c) 2021 .
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace BlockCat\GuestGamification;

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),
    (new Extend\ServiceProvider())
        ->register(Providers\GamificationProvider::class),
];
