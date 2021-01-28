import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import getPost from "app/posts/queries/getPost"
import deletePost from "app/posts/mutations/deletePost"

export const Post = () => {
  const router = useRouter()
  const postId = useParam("postId", "number")
  const [post] = useQuery(getPost, { where: { id: postId } })
  const [deletePostMutation] = useMutation(deletePost)

  return (
    <div>
      <h1>Post {post.id}</h1>
      <pre>{JSON.stringify(post, null, 2)}</pre>

      <Link href={`/posts/${post.id}/edit`}>
        <a>Edit</a>
      </Link>

      <button
        type="button"
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deletePostMutation({ where: { id: post.id } })
            router.push("/posts")
          }
        }}
      >
        Delete
      </button>
    </div>
  )
}

const ShowPostPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/posts">
          <a>Posts</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Post />
      </Suspense>
    </div>
  )
}

ShowPostPage.getLayout = (page) => <Layout title={"Post"}>{page}</Layout>

export default ShowPostPage
