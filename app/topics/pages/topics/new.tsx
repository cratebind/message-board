import Layout from "app/layouts/Layout"
import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import createTopic from "app/topics/mutations/createTopic"
import TopicForm, { TopicFormValues } from "app/topics/components/TopicForm"
import { Prisma } from "@prisma/client"

const NewTopicPage: BlitzPage = () => {
  const router = useRouter()
  const [createTopicMutation] = useMutation(createTopic)

  return (
    <div>
      <h1>Create New Topic</h1>

      <TopicForm
        initialValues={{
          title: "",
          body: "",
        }}
      />
    </div>
  )
}

NewTopicPage.getLayout = (page) => <Layout title={"Create New Topic"}>{page}</Layout>

export default NewTopicPage
