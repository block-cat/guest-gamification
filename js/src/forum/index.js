import { extend } from 'flarum/common/extend';
import CommentPost from 'flarum/forum/components/CommentPost';
import Button from 'flarum/common/components/Button';
import classList from 'flarum/common/utils/classList';
import saveVote from './helpers/saveVote';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import abbreviateNumber from 'flarum/common/utils/abbreviateNumber';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

app.initializers.add('block-cat/guest-gamification', () => {
  // exit if 'fof-gamification' isn't active
  if (!flarum.extensions['fof-gamification']) return;

  // extend(CommentPost.prototype, 'oncreate', function (vnode) {
  //   const post = this.attrs.post;
      
  //   const hasDownvoted = post.hasDownvoted();
  //   const hasUpvoted = post.hasUpvoted();

  //   // saveVote was created in './helpers/saveVote' and modified by BkC
  //   const onclick = (upvoted, downvoted) => saveVote(post, upvoted, downvoted, (val) => (this.voteLoading = val));

  //   let upvotes = $("button.Post-vote.Post-upvote");
    
  //   upvotes.map((index, upvote) => {
  //     upvote.onclick = () => onclick(!hasUpvoted, false) && console.log("Some");
  //   });
  //   console.log($("button.Post-vote.Post-upvote"));
  // });

  // import 'setting' function from 'fof-gamification.helpers'
  const {
    setting
  } = flarum.extensions['fof-gamification'].helpers;

  const get = (discussion, key) => {
    const post = discussion.firstPost();
  
    if (post && post[key]() !== undefined) {
      return post[key]();
    }
  
    return discussion[key]();
  };

  // change onclick function on comment post
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

  // change onclick function on DiscussionListItem
  if (setting('useAlternateLayout', true)) {
    extend(DiscussionListItem.prototype, 'view', function (view) {
      const discussion = this.attrs.discussion;

      if (!discussion.seeVotes()) {
        return;
      }

      if (!view || !view.children) return;

      const content = view.children.find((v) => v && v.attrs && v.attrs.className && v.attrs.className.includes('DiscussionListItem-content'));
      const post = discussion.firstPost();

      const hasUpvoted = get(discussion, 'hasUpvoted');
      const hasDownvoted = get(discussion, 'hasDownvoted');
      // We set canVote to true for guest users so that they can access the login by clicking the button
      const canVote = get(discussion, 'canVote');

      const upvotesOnly = setting('upVotesOnly', true);
      const altIcon = setting('iconNameAlt') || 'arrow';

      const onclick = (upvoted, downvoted) => saveVote(post, upvoted, downvoted, (val) => (this.voteLoading = val));

      // delete 'fof-gamification' version
      content.children.shift();
      content.children.unshift(
        <div className="DiscussionListItem-votes alternateLayout" data-upvotes-only={upvotesOnly}>
          <Button
            className="DiscussionListItem-voteButton DiscussionListItem-voteButton--up Button Button--icon Button--text"
            icon={`fas fa-fw fa-${altIcon}-up`}
            data-active={hasUpvoted}
            disabled={!canVote || this.voteLoading}
            onclick={() => onclick(!hasUpvoted, false)}
            aria-label={app.translator.trans('fof-gamification.forum.post.upvote_button')}
          />
  
          <span class="DiscussionListItem-voteCount">{abbreviateNumber(get(discussion, 'votes') || 0)}</span>
  
          {!upvotesOnly && (
            <Button
              className="DiscussionListItem-voteButton DiscussionListItem-voteButton--down Button Button--icon Button--text"
              icon={`fas fa-fw fa-${altIcon}-down`}
              data-active={hasDownvoted}
              disabled={!canVote || this.voteLoading}
              onclick={() => onclick(false, !hasDownvoted)}
              aria-label={app.translator.trans('fof-gamification.forum.post.downvote_button')}
            />
          )}
  
          {this.voteLoading && <LoadingIndicator display="inline" size="small" />}
        </div>
      );
    });
  };

  // change onclick function on CommentPost, alternative layout
  if (setting('altPostVotingUi', true)) {
    extend(CommentPost.prototype, 'headerItems', function (items) {
      if (items.has('votes')) {
        const post = this.attrs.post;

        if (!post.canSeeVotes()) return;

        const hasDownvoted = post.hasDownvoted();
        const hasUpvoted = post.hasUpvoted();

        const icon = setting('iconName') || 'thumbs';
        const upvotesOnly = setting('upVotesOnly', true);

        const canSeeVotes = post.canSeeVotes();

        // We set canVote to true for guest users so that they can access the login by clicking the button
        const canVote = !app.session.user || post.canVote();

        const onclick = (upvoted, downvoted) =>
          saveVote(post, upvoted, downvoted, (val) => {
            this.voteLoading = val;
          });
        
        items.replace(
          'votes',
          <div className="Post-votes alternateLayout" data-upvotes-only={upvotesOnly}>
            <Button
              className="Post-voteButton Post-voteButton--up Button Button--icon Button--text"
              icon={`fas fa-fw fa-${icon}-up`}
              data-active={hasUpvoted}
              disabled={!canVote || this.voteLoading || !canSeeVotes}
              onclick={() => onclick(!hasUpvoted, false)}
              aria-label={app.translator.trans('fof-gamification.forum.post.upvote_button')}
            />
    
            <span class="Post-voteCount">{abbreviateNumber(post.votes() || 0)}</span>
    
            {!upvotesOnly && (
              <Button
                className="Post-voteButton Post-voteButton--down Button Button--icon Button--text"
                icon={`fas fa-fw fa-${icon}-down`}
                data-active={hasDownvoted}
                disabled={!canVote || this.voteLoading}
                onclick={() => onclick(false, !hasDownvoted)}
                aria-label={app.translator.trans('fof-gamification.forum.post.downvote_button')}
              />
            )}
    
            {this.voteLoading && <LoadingIndicator display="inline" size="small" />}
          </div>,
          10000
        );
      }
    });
  };

});
