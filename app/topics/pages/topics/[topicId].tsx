import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import getTopic from "app/topics/queries/getTopic"
import deleteTopic from "app/topics/mutations/deleteTopic"
import { Heading, Text } from "minerva-ui"

export const Topic = () => {
  const router = useRouter()
  const topicId = useParam("topicId", "number")
  const [topic] = useQuery(getTopic, { where: { id: topicId } })
  const [deleteTopicMutation] = useMutation(deleteTopic)

  return (
    <div>
      <Heading as="h1" fontSize="3xl" mb={2}>
        {topic.title}
      </Heading>
      <Text>{topic.body}</Text>

      <Link href={`/topics/${topic.id}/edit`}>
        <a>Edit</a>
      </Link>

      <button
        type="button"
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deleteTopicMutation({ where: { id: topic.id } })
            router.push("/topics")
          }
        }}
      >
        Delete
      </button>
    </div>
  )
}

const ShowTopicPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/topics">
          <a>Back</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Topic />
      </Suspense>
    </div>
  )
}

ShowTopicPage.getLayout = (page) => <Layout title={"Topic"}>{page}</Layout>

export default ShowTopicPage
