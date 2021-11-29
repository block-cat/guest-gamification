<?php

namespace BlockCat\GuestGamification\Providers;

use Carbon\Carbon;
use FoF\Gamification\Listeners\SaveVotesToDatabase;
use FoF\Gamification\Vote;
use Flarum\Notification\Notification;
use FoF\Gamification\Notification\VoteBlueprint;
use FoF\Gamification\Events\PostWasVoted;
use FoF\Gamification\Rank;

class SavePostVote extends SaveVotesToDatabase
{
    public function vote($post, $isDownvoted, $isUpvoted, $actor, $user)
    {
        $vote = Vote::where([
            'post_id' => $post->id,
            'user_id' => $actor->id,
        ])->first();

        if ($vote) {
            if (!$isUpvoted && !$isDownvoted) {
                $vote->value = 0;

                $vote->delete();
            } else {
                if ($vote->isUpvote()) {
                    $vote->value = -1;
                } else {
                    $vote->value = 1;
                }

                $vote->save();
            }
        } else {
            $vote = Vote::build($post, $actor);

            if ($isDownvoted) {
                $vote->value = -1;
            } elseif ($isUpvoted) {
                $vote->value = 1;
            }

            $vote->save();
        }

        $this->pushNewVote($vote);

        $this->updatePoints($user, $post);

        $this->sendData($vote);

        $actor->last_vote_time = Carbon::now();
        if (!$actor->isGuest()) {
            $actor->save();
        }
    }
    
    public function sendData(Vote $vote)
    {
        $post = $vote->post;
        $user = $post->user;

        if (!$vote->user) {
            $notif = Notification::query()->where([
                'from_user_id'  => $vote->user,
                'type'          => 'vote',
                'subject_id'    => $post->id,
            ])->first();
        } else {
            $notif = Notification::query()->where([
                'from_user_id'  => $vote->user->id,
                'type'          => 'vote',
                'subject_id'    => $post->id,
            ])->first();
        }

        if ($notif) {
            if ($vote->value === 0) {
                $notif->delete();
            } else {
                $notif->data = $vote->value;
                $notif->save();
            }
        } elseif ($user && $user->id !== $vote->user->id && $vote->value !== 0) {
            $this->notifications->sync(
                new VoteBlueprint($vote),
                [$user]
            );
        }

        $this->events->dispatch(
            new PostWasVoted($vote)
        );
        
        if ($user) {
            $ranks = Rank::where('points', '<=', $user->votes)->pluck('id');
            
            $user->ranks()->sync($ranks);
        }
    }
}
