<?php

/*
 * This file was created based on files "FoF\Gamification\Jobs\VoteNotificationsJob"
 * and
 * deprecated method "sendData" from "FoF\Gamification\Listeners\SaveVotesToDatabase"
 */

namespace BlockCat\GuestGamification\Providers;

use FoF\Gamification\Jobs\VoteNotificationsJob;
use Flarum\Notification\Notification;
use Flarum\Notification\NotificationSyncer;
use FoF\Gamification\Notification\VoteBlueprint;

class PostVoteNotification extends VoteNotificationsJob
{
    public function handle(NotificationSyncer $notifications) {
        $post = $this->vote->post;
        $user = $post->user;

        // Modified by BlockCat
        // added 'if (!$this->vote->user)'
        // for guest access case
        if (!$this->vote->user) {
            $notif = Notification::query()->where([
                'from_user_id'  => $this->vote->user,
                'type'          => 'vote',
                'subject_id'    => $post->id,
            ])->first();
        } else {
            // original from 'fof/gamification'
            $notif = Notification::query()->where([
                'from_user_id'  => $this->vote->user->id,
                'type'          => 'vote',
                'subject_id'    => $post->id,
            ])->first();
        }

        if ($notif) {
            if ($this->vote->value === 0) {
                $notif->delete();
            } else {
                $notif->data = $this->vote->value;
                $notif->save();
            }
        } elseif ($user && $user->id !== $this->vote->user->id && $this->vote->value !== 0) {
            if ($user->can('canSeeVoters', $post->discussion)) {
                if ($this->vote->value === 1 && $user->can('upvote_notifications', $post->discussion) || $this->vote->value === -1 && $user->can('downvote_notifications', $post->discussion)) {
                    $notifications->sync(
                        new VoteBlueprint($this->vote),
                        [$user]
                    );
                }
            }
        }
    }
}
