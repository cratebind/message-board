import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import getTopic from "app/topics/queries/getTopic"
import updateTopic from "app/topics/mutations/updateTopic"
import TopicForm from "app/topics/components/TopicForm"

export const EditTopic = () => {
  const router = useRouter()
  const topicId = useParam("topicId", "number")
  const [topic, { setQueryData }] = useQuery(getTopic, { where: { id: topicId } })
  const [updateTopicMutation] = useMutation(updateTopic)

  return (
    <div>
      <h1>Edit Topic {topic.id}</h1>
      <pre>{JSON.stringify(topic)}</pre>

      <TopicForm
        initialValues={topic}
        onSubmit={async () => {
          try {
            const updated = await updateTopicMutation({
              where: { id: topic.id },
              data: { name: "MyNewName" },
            })
            await setQueryData(updated)
            alert("Success!" + JSON.stringify(updated))
            router.push(`/topics/${updated.id}`)
          } catch (error) {
            console.log(error)
            alert("Error editing topic " + JSON.stringify(error, null, 2))
          }
        }}
      />
    </div>
  )
}

const EditTopicPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditTopic />
      </Suspense>

      <p>
        <Link href="/topics">
          <a>Topics</a>
        </Link>
      </p>
    </div>
  )
}

EditTopicPage.getLayout = (page) => <Layout title={"Edit Topic"}>{page}</Layout>

export default EditTopicPage
