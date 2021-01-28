import { Link, BlitzPage, useMutation } from "blitz"
import Layout from "app/layouts/Layout"
import logout from "app/auth/mutations/logout"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import { Suspense } from "react"
import { Box, Button, Flex, Link as StyledLink, Stack } from "minerva-ui"
import { TopicsList } from "app/topics/pages/topics"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

export const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  return (
    <Stack
      horizontal
      as="nav"
      justifyContent="flex-end"
      p={3}
      alignItems="center"
      borderBottomWidth="1px"
      mb={4}
    >
      {Boolean(currentUser) ? (
        <>
          <Link href="/topics/new">
            <Button as="a">Create Post</Button>
          </Link>
          <Button
            className="button small"
            onClick={async () => {
              await logoutMutation()
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
  )
}

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <Suspense fallback="Loading...">
          <TopicsList />
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
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
