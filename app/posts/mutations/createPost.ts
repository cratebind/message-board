import { Ctx } from "blitz"
import db, { Prisma } from "db"

type CreatePostInput = Pick<Prisma.PostCreateArgs, "data">
export default async function createPost({ data }: CreatePostInput, ctx: Ctx) {
  ctx.session.authorize()

  const post = await db.post.create({
    data: {
      ...data,
      user: {
        connect: {
          id: ctx.session.userId,
        },
      },
    },
  })

  return post
}
