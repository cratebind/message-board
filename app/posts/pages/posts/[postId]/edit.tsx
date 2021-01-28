import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import getPost from "app/posts/queries/getPost"
import updatePost from "app/posts/mutations/updatePost"
import PostForm from "app/posts/components/PostForm"

export const EditPost = () => {
  const router = useRouter()
  const postId = useParam("postId", "number")
  const [post, { setQueryData }] = useQuery(getPost, { where: { id: postId } })
  const [updatePostMutation] = useMutation(updatePost)

  return (
    <div>
      <h1>Edit Post {post.id}</h1>
      <pre>{JSON.stringify(post)}</pre>

      <PostForm
        initialValues={post}
        onSubmit={async () => {
          try {
            const updated = await updatePostMutation({
              where: { id: post.id },
              data: { name: "MyNewName" },
            })
            await setQueryData(updated)
            alert("Success!" + JSON.stringify(updated))
            router.push(`/posts/${updated.id}`)
          } catch (error) {
            console.log(error)
            alert("Error editing post " + JSON.stringify(error, null, 2))
          }
        }}
      />
    </div>
  )
}

const EditPostPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPost />
      </Suspense>

      <p>
        <Link href="/posts">
          <a>Posts</a>
        </Link>
      </p>
    </div>
  )
}

EditPostPage.getLayout = (page) => <Layout title={"Edit Post"}>{page}</Layout>

export default EditPostPage
