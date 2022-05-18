### 2.0.0

- Modificarea instrucțiunilor după verificarea parametrilor în metoda `vote` din clasa `BlockCat\GuestGamification\Providers\SavePostVote`.
- Eliminarea metodei `sendData` din clasa `BlockCat\GuestGamification\Providers\SavePostVote` și eliminarea utilizării acesteea.
- Modificarea versiunii de dependență a `flarum/core` de la `1.2.1` la `1.3`.
- Înlocuirea clasei `FoF\Gamification\Listeners\QueueJobs` cu clasa `BlockCat\GuestGamification\Providers\NotificationJob`.
- Suprascrierea metodei `notifications` din clasa `FoF\Gamification\Listeners\QueueJobs` în clasa `BlockCat\GuestGamification\Providers\NotificationJob`.
- Înlocuirea `Jobs\VoteNotificationsJob` cu `PostVoteNotification` în metoda `notifications`.
- Suprascrierea metodei `handle` din clasa `FoF\Gamification\Jobs\VoteNotificationsJob` în clasa `BlockCat\GuestGamification\Providers\PostVoteNotification`.
- Adăugarea verificarea existenței unui utilizator valid al aprecierii în metoda `handle`.

### 1.0.0

- Permiterea persoanelor neînregistrate să aprecieze comentariile.