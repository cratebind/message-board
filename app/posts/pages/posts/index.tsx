import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import getPosts from "app/posts/queries/getPosts"
import { Button } from "minerva-ui"

const ITEMS_PER_PAGE = 100

export const PostsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ posts, hasMore }] = usePaginatedQuery(getPosts, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>
              <a>{post.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <Button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </Button>
      <Button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </Button>
    </div>
  )
}

const PostsPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/posts/new">
          <a>Create Post</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <PostsList />
      </Suspense>
    </div>
  )
}

PostsPage.getLayout = (page) => <Layout title={"Posts"}>{page}</Layout>

export default PostsPage
