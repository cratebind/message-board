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
import { Box, Button, Flex, Heading, Stack, Text } from 'minerva-ui';
import PostForm from 'app/posts/components/PostForm';
import { useCurrentUser } from 'app/hooks/useCurrentUser';
import ReactMarkdown from 'react-markdown';

function hashCode(str) {
  // java String#hashCode
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 3) - hash);
  }
  return hash;
}

function intToRGB(i) {
  // eslint-disable-next-line
  const c = (i & 0x00FFFFFF).toString(16).toUpperCase();

  return '00000'.substring(0, 6 - c.length) + c;
}

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
        {topic.posts.map((post) => {
          const number = hashCode(post.user.username);
          const color = intToRGB(number);

          const initial = post.user?.username?.[0];
          return (
            <Box
              key={post.id}
              paddingTop={6}
              paddingBottom={6}
              marginTop={6}
              borderTopWidth="1px"
            >
              <Flex alignItems="center" mb={2}>
                <Flex
                  mr={2}
                  height="36px"
                  width="36px"
                  borderRadius="full"
                  bg={`#${color}cc`}
                  alignItems="center"
                  justifyContent="center"
                >
                  {initial.toUpperCase()}
                </Flex>
                <Text color="gray.500" fontSize="base">
                  {post.user.username}
                </Text>
              </Flex>
              <div className="prose">
                <ReactMarkdown>{post.body}</ReactMarkdown>
              </div>
            </Box>
          );
        })}
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
