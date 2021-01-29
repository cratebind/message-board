import Layout from "app/layouts/Layout"
import { useRouter, useMutation, BlitzPage } from "blitz"
import createTopic from "app/topics/mutations/createTopic"
import TopicForm, { TopicFormValues } from "app/topics/components/TopicForm"

const NewTopicPage: BlitzPage = () => {
  const router = useRouter()
  const [createTopicMutation] = useMutation(createTopic)

  return (
    <div>
      <TopicForm
        initialValues={{
          title: "",
          body: "",
        }}
        onSubmit={async (values: TopicFormValues) => {
          const topic = await createTopicMutation({ data: values })
          router.push(`/topics/${topic.id}`)
        }}
      />
    </div>
  )
}

NewTopicPage.getLayout = (page) => <Layout title={"Create New Topic"}>{page}</Layout>

export default NewTopicPage
