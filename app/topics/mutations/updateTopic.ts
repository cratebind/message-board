import { AuthorizationError, Ctx } from "blitz"
import db, { Prisma } from "db"

type UpdateTopicInput = Pick<Prisma.TopicUpdateArgs, "where" | "data">

export default async function updateTopic({ where, data }: UpdateTopicInput, ctx: Ctx) {
  ctx.session.authorize()

  const topic = await db.topic.findUnique({ where })

  console.log({ topic, userId: ctx.session.userId })

  if (topic?.userId !== ctx.session.userId) {
    throw new AuthorizationError()
  }

  const updatedTopic = await db.topic.update({ where, data })

  return updatedTopic
}
