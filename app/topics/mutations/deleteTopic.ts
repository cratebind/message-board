import { Ctx } from "blitz"
import db, { Prisma } from "db"

type DeleteTopicInput = Pick<Prisma.TopicDeleteArgs, "where">

export default async function deleteTopic({ where }: DeleteTopicInput, ctx: Ctx) {
  ctx.session.authorize()

  const topic = await db.topic.delete({ where })

  return topic
}
