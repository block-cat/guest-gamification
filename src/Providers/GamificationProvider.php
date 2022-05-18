<?php

namespace BlockCat\GuestGamification\Providers;

use Flarum\Foundation\AbstractServiceProvider;
use FoF\Gamification\Listeners\SaveVotesToDatabase;
use FoF\Gamification\Listeners\QueueJobs;

class GamificationProvider extends AbstractServiceProvider
{
    public function register()
    {
        // use SavePostVote::class instead of SaveVotesToDatabase::class
        $this->container->bind(SaveVotesToDatabase::class, SavePostVote::class);
        // use NotificationJob::class instead of QueueJobs::class
        $this->container->bind(QueueJobs::class, NotificationJob::class);
    }
}
