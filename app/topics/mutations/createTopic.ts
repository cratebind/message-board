import { Ctx } from "blitz"
import db, { Prisma } from "db"
import { TopicFormValues } from "../components/TopicForm"

type CreateTopicInput = Pick<Prisma.TopicCreateArgs, "data">

export default async function createTopic({ data }: { data: TopicFormValues }, ctx: Ctx) {
  ctx.session.authorize()

  const topic = await db.topic.create({
    data: {
      ...data,
      user: {
        connect: {
          id: ctx.session.userId,
        },
      },
    },
  })

  return topic
}
