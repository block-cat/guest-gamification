export default (post, upvoted, downvoted, load, discussion = post.discussion()) => {
  // BkC deleted 'if(!app.session.user)' condition from here
  if (discussion && !discussion.canVote() && !post.canVote()) {
    return;
  }

  if (upvoted && downvoted) {
    upvoted = false;
    downvoted = false;
  }

  if (load) load(true);

  m.redraw();

  return post
    .save([upvoted, downvoted, 'vote'])
    .then(
      () => null,
      () => null
    )
    .then(() => {
      if (load) load(false);

      if (discussion) {
        discussion.pushAttributes({
          votes: post.votes(),
        });
      }

      m.redraw();
    });
};