import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetTopicsInput = Pick<Prisma.FindManyTopicArgs, "where" | "orderBy" | "skip" | "take">

export default async function getTopics(
  { where, orderBy, skip = 0, take }: GetTopicsInput,
  ctx: Ctx
) {
  ctx.session.authorize()

  const topics = await db.topic.findMany({
    where,
    orderBy,
    take,
    skip,
    include: {
      user: true,
    },
  })

  const count = await db.topic.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    topics,
    nextPage,
    hasMore,
    count,
  }
}
