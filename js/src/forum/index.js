import { extend } from 'flarum/common/extend';
import CommentPost from 'flarum/forum/components/CommentPost';
import Button from 'flarum/common/components/Button';
import classList from 'flarum/common/utils/classList';
import saveVote from './helpers/saveVote';

app.initializers.add('block-cat/guest-gamification', () => {
  // exit if 'fof-gamification' isn't active
  if (!flarum.extensions['fof-gamification']) return;

  // import 'setting' function from 'fof-gamification.helpers'
  const {
    setting
  } = flarum.extensions['fof-gamification'].helpers;

  // console.log(flarum.extensions['fof-gamification'].helpers);
  extend(CommentPost.prototype, 'actionItems', function (items) {
    if (items.has('votes')) {
      // same code from 'fof-gamification'
      const post = this.attrs.post;
      
      const hasDownvoted = post.hasDownvoted();
      const hasUpvoted = post.hasUpvoted();
      
      const icon = setting('iconName') || 'thumbs';
      const upVotesOnly = setting('upVotesOnly', true);
      
      const canSeeVotes = post.canSeeVotes();
      
      // We set canVote to true for guest users so that they can access the login by clicking the button
      const canVote = post.canVote(); // modified by BkC
      
      // saveVote was created in './helpers/saveVote' and modified by BkC
      const onclick = (upvoted, downvoted) => saveVote(post, upvoted, downvoted, (val) => (this.voteLoading = val));
      
      // replace with same component but
      // onclick call another 'saveVote' function
      items.replace(
        'votes',
        <div className={classList('CommentPost-votes', setting('useAlternateLayout', true) && 'alternateLayout')}>
          {Button.component({
            icon: this.voteLoading ? undefined : `fas fa-fw fa-${icon}-up`,
            className: classList('Post-vote Post-upvote', hasUpvoted && 'Post-vote--active'),
            loading: this.voteLoading,
            disabled: this.voteLoading || !canVote || !canSeeVotes,
            onclick: () => onclick(!hasUpvoted, false),
            'aria-label': app.translator.trans('fof-gamification.forum.post.upvote_button'),
          })}

          <label className="Post-points">{post.votes()}</label>

          {!upVotesOnly &&
            Button.component({
              icon: this.voteLoading ? undefined : `fas fa-fw fa-${icon}-down`,
              className: classList('Post-vote Post-downvote', hasDownvoted && 'Post-vote--active'),
              loading: this.voteLoading,
              disabled: !canVote || !canSeeVotes,
              onclick: () => onclick(false, !hasDownvoted),
              'aria-label': app.translator.trans('fof-gamification.forum.post.downvote_button'),
            })}
        </div>,
        10
      );
    }
  });
});
