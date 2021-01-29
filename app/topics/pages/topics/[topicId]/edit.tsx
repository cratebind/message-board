import { Suspense } from "react";
import Layout from "app/layouts/Layout";
import {
  Link,
  useRouter,
  useQuery,
  useMutation,
  useParam,
  BlitzPage,
  AuthorizationError,
} from "blitz";
import getTopic from "app/topics/queries/getTopic";
import updateTopic from "app/topics/mutations/updateTopic";
import TopicForm from "app/topics/components/TopicForm";
import { useCurrentUser } from "app/hooks/useCurrentUser";

export const EditTopic = () => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const topicId = useParam("topicId", "number");
  const [topic, { setQueryData }] = useQuery(getTopic, {
    where: { id: topicId },
  });
  const [updateTopicMutation] = useMutation(updateTopic);

  if (!topic) return null;

  if (
    Boolean(currentUser) &&
    Boolean(topic) &&
    currentUser?.id !== topic.userId
  ) {
    throw new AuthorizationError();
  }

  return (
    <div>
      <h1>Edit Topic</h1>

      <TopicForm
        initialValues={topic}
        submitText="Update Topic"
        onSubmit={async ({ title, body }) => {
          try {
            const updated = await updateTopicMutation({
              where: { id: topic.id },
              data: {
                title,
                body,
              },
            });
            // @ts-ignore
            await setQueryData(updated);
            router.push(`/topics/${updated.id}`);
          } catch (error) {
            throw new Error(error);
          }
        }}
      />
    </div>
  );
};

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
  );
};

EditTopicPage.getLayout = (page) => (
  <Layout title={"Edit Topic"}>{page}</Layout>
);

export default EditTopicPage;
