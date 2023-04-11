import { router } from '../trpc';
import { posts } from './posts';
import { user } from './user';
import { auth } from './auth';

export const appRouter = router({
  posts,
  user,
  auth,
});

export type AppRouter = typeof appRouter;
