import { Suspense } from 'react';
import Layout from 'app/layouts/Layout';
import {
  Link,
  useRouter,
  useQuery,
  useParam,
  BlitzPage,
  useMutation,
} from 'blitz';
import getTopic from 'app/topics/queries/getTopic';
import deleteTopic from 'app/topics/mutations/deleteTopic';
import { Box, Button, Heading, Stack, Text } from 'minerva-ui';
import PostForm from 'app/posts/components/PostForm';
import { useCurrentUser } from 'app/hooks/useCurrentUser';
import ReactMarkdown from 'react-markdown';

export const Topic = () => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const topicId = useParam('topicId', 'number');
  const [topic] = useQuery(getTopic, { where: { id: topicId } });
  const [deleteTopicMutation] = useMutation(deleteTopic);

  return (
    <div>
      <Heading as="h1" fontSize="3xl" mb={2}>
        {topic.title}
      </Heading>
      <Text>{topic.body}</Text>

      {currentUser?.id === topic.userId && (
        <Stack horizontal mt={8}>
          <Link href={`/topics/${topic.id}/edit`}>
            <a>
              <Button>Edit</Button>
            </a>
          </Link>

          <Button
            type="button"
            onClick={async () => {
              if (window.confirm('This will be deleted')) {
                await deleteTopicMutation({ where: { id: topic.id } });
                router.push('/topics');
              }
            }}
          >
            Delete
          </Button>
        </Stack>
      )}

      <Stack gap="10px">
        {topic.posts.map((post) => (
          <Box
            key={post.id}
            paddingTop={6}
            paddingBottom={6}
            marginTop={6}
            borderTopWidth="1px"
          >
            <Text color="gray.500" fontSize="base">
              {post.user.username}
            </Text>
            <div className="prose">
              <ReactMarkdown>{post.body}</ReactMarkdown>
            </div>
          </Box>
        ))}
      </Stack>

      <Box borderTopWidth="1px" marginTop={8} pt={8}>
        <PostForm
          initialValues={{}}
          topicId={topic.id}
          // onSubmit={(values) => console.log(values)}
        />
      </Box>
    </div>
  );
};

const ShowTopicPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/topics">
          <a>
            <Button>Back</Button>
          </a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Topic />
      </Suspense>
    </div>
  );
};

ShowTopicPage.getLayout = (page) => <Layout title={'Topic'}>{page}</Layout>;

export default ShowTopicPage;
