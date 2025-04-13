import { router } from '@/server/trpc';
import { posts } from '@/server/routers/posts';
import { user } from '@/server/routers/user';
import { auth } from '@/server/routers/auth';

export const appRouter = router({
  posts,
  user,
  auth,
});

export type AppRouter = typeof appRouter;
