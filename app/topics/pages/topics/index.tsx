import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import getTopics from "app/topics/queries/getTopics"
import { Box, Button, Heading, Text } from "minerva-ui"

const ITEMS_PER_PAGE = 100

export const TopicsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ topics, hasMore }] = usePaginatedQuery(getTopics, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <div>
        {topics.map((topic) => (
          <Box key={topic.id} py={4}>
            <Link href={`/topics/${topic.id}`}>
              <a>
                <Heading as="h3" fontSize="xl">
                  {topic.title}
                </Heading>
              </a>
            </Link>
            <Text color="gray.600">{topic.body}</Text>
            <Text mt={2}>{topic.user?.email}</Text>
          </Box>
        ))}
      </div>

      <Button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </Button>
      <Button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </Button>
    </div>
  )
}

const TopicsPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/topics/new">
          <a>Create Topic</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <TopicsList />
      </Suspense>
    </div>
  )
}

TopicsPage.getLayout = (page) => <Layout title={"Topics"}>{page}</Layout>

export default TopicsPage
