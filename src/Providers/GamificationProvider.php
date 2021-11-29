<?php

namespace BlockCat\GuestGamification\Providers;

use Flarum\Foundation\AbstractServiceProvider;
use FoF\Gamification\Listeners\SaveVotesToDatabase;

class GamificationProvider extends AbstractServiceProvider
{
    public function register()
    {
        // execute SavePostVote::class instead of SaveVotesToDatabase::class
        $this->container->bind(SaveVotesToDatabase::class, SavePostVote::class);
    }
}
