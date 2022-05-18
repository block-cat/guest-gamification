<?php

/*
 * This file was created based on file "FoF\Gamification\Listeners\SaveVotesToDatabase"
 */

namespace BlockCat\GuestGamification\Providers;

use Carbon\Carbon;
use FoF\Gamification\Listeners\SaveVotesToDatabase;
use FoF\Gamification\Vote;
use FoF\Gamification\Events\PostWasVoted;
use FoF\Gamification\Rank;

class SavePostVote extends SaveVotesToDatabase
{
    public function vote($post, $isDownvoted, $isUpvoted, $actor, $user)
    {
        /**
         * @var Vote $vote
         */
        $vote = Vote::where([
            'post_id' => $post->id,
            'user_id' => $actor->id,
        ])->first();

        if ($vote) {
            if (!$isUpvoted && !$isDownvoted) {
                $vote->value = 0;

                $vote->save();
            } else {
                if ($isUpvoted) {
                    $vote->value = 1;
                } elseif ($isDownvoted) {
                    $vote->value = -1;
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

        if ($voteUser = $vote->post->user) {
            $ranks = Rank::where('points', '<=', $voteUser->votes)->pluck('id');

            $voteUser->ranks()->sync($ranks);
        }

        $actor->last_vote_time = Carbon::now();

        // Modified by BlockCat
        // for guest access case
        if (!$actor->isGuest()) {
            $actor->save(); // original from 'fof/gamification'
        }

        $this->events->dispatch(
            new PostWasVoted($vote)
        );
    }
}
