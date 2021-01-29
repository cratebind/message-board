import { Suspense } from 'react';
import Layout from 'app/layouts/Layout';
import { Link, usePaginatedQuery, useRouter, BlitzPage } from 'blitz';
import getTopics from 'app/topics/queries/getTopics';
import { Box, Button, Flex, Heading, Stack, Text } from 'minerva-ui';
import { InitialData } from 'app/pages';

export const ITEMS_PER_PAGE = 2;

export const TopicsList = ({ initialData }: { initialData?: InitialData }) => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ topics, hasMore }] = usePaginatedQuery(
    getTopics,
    {
      orderBy: { updatedAt: 'desc' },
      skip: ITEMS_PER_PAGE * page,
      take: ITEMS_PER_PAGE,
    },
    {
      initialData,
    }
  );

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <div>
        {topics?.map((topic) => (
          <Box key={topic.id} mb={6}>
            <Link href={`/topics/${topic.id}`}>
              <a>
                <Heading
                  as="h2"
                  color="gray.900"
                  fontSize="lg"
                  fontWeight="500"
                  mb={2}
                >
                  {topic.title}
                </Heading>
              </a>
            </Link>
            <Text
              fontWeight={400}
              color="gray.600"
              fontSize="base"
              lineHeight={1}
            >
              {topic.body}
            </Text>
            <Flex justifyContent="space-between" mt={2} alignItems="flex-end">
              <Link href={`/topics/${topic.id}`}>
                <a>
                  <Text color="gray.500" fontSize="base">
                    {topic.posts.length} Comments
                  </Text>
                </a>
              </Link>

              <Text color="gray.400" fontSize="xs">
                {topic.user?.username}
              </Text>
            </Flex>
          </Box>
        ))}
      </div>

      <Stack horizontal>
        <Button disabled={page === 0} onClick={goToPreviousPage}>
          Previous
        </Button>
        <Button disabled={!hasMore} onClick={goToNextPage}>
          Next
        </Button>
      </Stack>
    </div>
  );
};

const TopicsPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <TopicsList />
      </Suspense>
    </div>
  );
};

TopicsPage.getLayout = (page) => <Layout title={'Topics'}>{page}</Layout>;

export default TopicsPage;
