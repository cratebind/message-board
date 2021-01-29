import { Link, useMutation, InferGetServerSidePropsType } from 'blitz';
import Layout from 'app/layouts/Layout';
import logout from 'app/auth/mutations/logout';
import { useCurrentUser } from 'app/hooks/useCurrentUser';
import { Suspense } from 'react';
import { Button, Heading, Stack } from 'minerva-ui';
import { ITEMS_PER_PAGE, TopicsList } from 'app/topics/pages/topics';
import getTopics from 'app/topics/queries/getTopics';
import { Post, Topic, User } from '@prisma/client';

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

export const UserInfo = () => {
  const currentUser = useCurrentUser();
  const [logoutMutation] = useMutation(logout);

  return (
    <Stack
      horizontal
      as="nav"
      justifyContent="space-between"
      p={3}
      alignItems="center"
      borderBottomWidth="1px"
      mb={4}
    >
      <Link href="/">
        <a>
          <Heading as="h2" fontSize="lg">
            Message Board
          </Heading>
        </a>
      </Link>

      <Stack horizontal>
        {Boolean(currentUser) ? (
          <>
            <Link href="/topics/new">
              <Button as="a">Create Topic</Button>
            </Link>
            <Button
              className="button small"
              onClick={async () => {
                await logoutMutation();
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/signup">
              <a>Sign Up</a>
            </Link>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </>
        )}
      </Stack>
    </Stack>
  );
};

export type InitialData = {
  topics: (Topic & { user: User; posts: Post[] })[];
  nextPage: { take: number | undefined; skip: number } | null;
  hasMore: boolean;
  count: number;
};

const Home = ({
  initialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // console.log(topics)
  return (
    <div className="container">
      <main>
        <Suspense fallback="Loading...">
          <TopicsList initialData={initialData} />
        </Suspense>
      </main>

      <footer>
        {/* <a
          href="https://blitzjs.com?utm_source=blitz-new&utm_medium=app-template&utm_campaign=blitz-new"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Blitz.js
        </a> */}
      </footer>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { page = 0 }: { page?: number } = context.query;
  const initialData = await getTopics({
    orderBy: { updatedAt: 'desc' },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  return {
    props: {
      initialData,
    },
  };
};

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>;

export default Home;
