import Form from 'app/components/Form';
import LabeledTextField from 'app/components/LabeledTextField';
import React from 'react';

type TopicFormProps = {
  initialValues: any;
  onSubmit: (values: any) => void;
  onSuccess?: (values: any) => void;
  submitText?: string;
};

export type TopicFormValues = {
  title: string;
  body: string;
  topicId: string;
};

const TopicForm = ({
  initialValues = {},
  onSubmit,
  onSuccess,
  ...props
}: TopicFormProps) => {
  return (
    <Form
      submitText="Create Topic"
      initialValues={initialValues}
      onSubmit={async (values) => {
        try {
          const topic = await onSubmit(values);
          onSuccess?.(topic);
        } catch (error) {
          throw new Error(error);
        }
      }}
      {...props}
    >
      <LabeledTextField name="title" placeholder="Title" />
      <LabeledTextField name="body" placeholder="Topic Content" as="textarea" />
    </Form>
  );
};

export default TopicForm;
