import { Ctx, NotFoundError } from 'blitz';
import db, { Prisma } from 'db';

type GetTopicInput = Pick<Prisma.FindFirstTopicArgs, 'where'>;

export default async function getTopic({ where }: GetTopicInput, ctx: Ctx) {
  const topic = await db.topic.findFirst({
    where,
    include: { posts: { include: { user: true } } },
  });

  if (!topic) throw new NotFoundError();

  return topic;
}
