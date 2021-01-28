import Layout from "app/layouts/Layout"
import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import createPost from "app/posts/mutations/createPost"
import PostForm from "app/posts/components/PostForm"

const NewPostPage: BlitzPage = () => {
  const router = useRouter()
  const [createPostMutation] = useMutation(createPost)

  return (
    <div>
      <h1>Create New Post</h1>

      <PostForm
        initialValues={{}}
        onSubmit={async () => {
          try {
            const post = await createPostMutation({ data: { name: "MyName" } })
            alert("Success!" + JSON.stringify(post))
            router.push(`/posts/${post.id}`)
          } catch (error) {
            alert("Error creating post " + JSON.stringify(error, null, 2))
          }
        }}
      />

      <p>
        <Link href="/posts">
          <a>Posts</a>
        </Link>
      </p>
    </div>
  )
}

NewPostPage.getLayout = (page) => <Layout title={"Create New Post"}>{page}</Layout>

export default NewPostPage
