import Form from 'app/components/Form';
import LabeledTextField from 'app/components/LabeledTextField';
import getTopic from 'app/topics/queries/getTopic';
import { useMutation, useQuery } from 'blitz';
import React from 'react';
import createPost from '../mutations/createPost';

type PostFormProps = {
  initialValues: any;
  topicId: number;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

const PostForm = ({ initialValues, topicId, onSubmit }: PostFormProps) => {
  const [createPostMutation] = useMutation(createPost);
  const [, { refetch }] = useQuery(getTopic, { where: { id: topicId } });

  return (
    <Form
      submitText="Create Post"
      onSubmit={async (values) => {
        try {
          await createPostMutation({
            data: {
              ...values,
              topic: {
                connect: { id: topicId },
              },
            },
          });
          await refetch();
        } catch (error) {
          alert('Error creating post ' + JSON.stringify(error, null, 2));
        }
      }}
    >
      <LabeledTextField name="body" as="textarea" />
    </Form>
  );
};

export default PostForm;
