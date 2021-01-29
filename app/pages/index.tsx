import { Link, useMutation, InferGetServerSidePropsType } from 'blitz';
import Layout from 'app/layouts/Layout';
import logout from 'app/auth/mutations/logout';
import { useCurrentUser } from 'app/hooks/useCurrentUser';
import React, { Suspense } from 'react';
import {
  Button,
  Heading,
  MenuButton,
  MenuContainer,
  Stack,
  Text,
  Image,
  MenuList,
  MenuItem,
  MenuLink,
  MenuDivider,
  Icon,
  Box,
} from 'minerva-ui';
import { ITEMS_PER_PAGE, TopicsList } from 'app/topics/pages/topics';
import getTopics from 'app/topics/queries/getTopics';
import { Post, Topic, User } from '@prisma/client';

export const NavBar = () => {
  return (
    <Stack
      horizontal
      as="nav"
      justifyContent="space-between"
      p={3}
      alignItems="center"
      borderBottomWidth="1px"
      mb={4}
      height="60px"
    >
      <Link href="/">
        <a>
          <Heading as="h2" fontSize="lg">
            Message Board
          </Heading>
        </a>
      </Link>
      <Suspense fallback="">
        <UserInfo />
      </Suspense>
    </Stack>
  );
};

export const UserInfo = () => {
  const currentUser = useCurrentUser();
  const [logoutMutation] = useMutation(logout);

  return (
    <Stack horizontal>
      {Boolean(currentUser) ? (
        <MenuContainer>
          <MenuButton p={2} variant="primary">
            <Text color="white">{currentUser?.username}</Text>
            <Box ml={2} color="white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="presentation" className="sc-bdfBwQ ggQcPc"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </Box>
          </MenuButton>
          <MenuList menuPosition="right">
            <Link href="/topics/new">
              <MenuLink>Create Topic</MenuLink>
            </Link>
            <MenuItem
              onSelect={async () => {
                await logoutMutation();
              }}
            >
              Log Out
            </MenuItem>
          </MenuList>
        </MenuContainer>
      ) : (
        <>
          <Link href="/signup">
            <Button as="a" variant="primary">
              Sign Up
            </Button>
          </Link>
          <Link href="/login">
            <Button as="a" variant="primary">
              Login
            </Button>
          </Link>
        </>
      )}
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
      initialData: initialData || undefined,
    },
  };
};

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>;

export default Home;
