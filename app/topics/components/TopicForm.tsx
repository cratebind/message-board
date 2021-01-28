import { TopicCreateInput } from "@prisma/client"
import Form from "app/components/Form"
import LabeledTextField from "app/components/LabeledTextField"
import { useMutation, useRouter } from "blitz"
import React from "react"
import createTopic from "../mutations/createTopic"

type TopicFormProps = {
  initialValues: any
  onSuccess?: () => void
}

export type TopicFormValues = {
  title: string
  body: string
  topicId: string
}

const TopicForm = ({ initialValues, onSuccess }: TopicFormProps) => {
  const router = useRouter()
  const [createTopicMutation] = useMutation(createTopic)
  return (
    <Form
      submitText="Create Topic"
      onSubmit={async (values: TopicFormValues) => {
        try {
          const topic = await createTopicMutation({ data: values })
          router.push(`/topics/${topic.id}`)
        } catch (error) {
          alert("Error creating topic " + JSON.stringify(error, null, 2))
        }
      }}
    >
      <LabeledTextField name="title" label="Title" />
      <LabeledTextField name="body" label="Body" as="textarea" />
    </Form>
  )
}

export default TopicForm
