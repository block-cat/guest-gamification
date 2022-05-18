<?php

/*
 * This file was created based on file "FoF\Gamification\Listeners\QueueJobs"
 */

namespace BlockCat\GuestGamification\Providers;

use FoF\Gamification\Listeners\QueueJobs;
use FoF\Gamification\Events\PostWasVoted;

class NotificationJob extends QueueJobs
{
    public function notifications(PostWasVoted $event)
    {
        resolve('flarum.queue.connection')->push(
            new PostVoteNotification($event->vote)
        );
    }
}
