import { extend } from 'flarum/common/extend';
import PermissionGrid from 'flarum/admin/components/PermissionGrid';

function allowGuest(items, key) {
  if (!items.has(key)) {
      return;
  }

  items.get(key).allowGuest = true;
}

app.initializers.add('block-cat/guest-gamification', () => {
  extend(PermissionGrid.prototype, 'replyItems', items => {
    allowGuest(items, 'discussion.votePosts');
  });
});
