import { LikedPost, Post } from "@/types/types"
import { Session } from "next-auth"

// Counts likes in the database and only loads the viewer's own like, instead
// of fetching every LikedPost row of each post.
export const postInclude = (session: Session | null) =>
  ({
    user: {
      omit: { email: true, emailVerified: true },
    },
    likedBy: { where: { userId: session?.user.id ?? "" } },
    _count: { select: { likedBy: true } },
  }) as const

export const infiniteQuery = (
  posts: (Omit<Post, "isLiked" | "likes"> & {
    user: { id: string; name: string; image: string; createdAt: Date }
    likedBy: LikedPost[]
    _count: { likedBy: number }
  })[],
  { limit, cursor, session }: { limit: number; cursor?: string; session: Session | null }
) => {
  let nextCursor: typeof cursor | undefined = undefined
  if (posts.length > limit) {
    const nextItem = posts.pop()
    nextCursor = nextItem!.id
  }

  return {
    posts: posts.map(({ _count, ...post }) => {
      return {
        ...post,
        likes: _count.likedBy,
        isLiked: post.likedBy.some((like) => like.userId === session?.user.id),
      }
    }),
    nextCursor,
  }
}
