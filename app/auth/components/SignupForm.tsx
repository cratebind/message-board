import React from 'react';
import { useMutation } from 'blitz';
import { LabeledTextField } from 'app/components/LabeledTextField';
import { Form, FORM_ERROR } from 'app/components/Form';
import signup from 'app/auth/mutations/signup';
import { SignupInput } from 'app/auth/validations';
import { AuthWrapper } from './LoginForm';
import { Box, Heading, Text } from 'minerva-ui';

type SignupFormProps = {
  onSuccess?: () => void;
};

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup);

  return (
    <AuthWrapper>
      <Box textAlign="center" pb={4}>
        <Heading as="h2" fontSize="2xl" py={2}>
          Cratebind Message Board
        </Heading>
        <Text>Create Your Account</Text>
      </Box>
      <Form
        submitText="Create Account"
        schema={SignupInput}
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values);
            props.onSuccess?.();
          } catch (error) {
            if (
              error.code === 'P2002' &&
              error.meta?.target?.includes('username')
            ) {
              // This error comes from Prisma
              return { username: 'This username is already being used' };
            } else {
              return { [FORM_ERROR]: error.toString() };
            }
          }
        }}
      >
        <LabeledTextField name="username" placeholder="Username" />
        <LabeledTextField
          name="password"
          placeholder="Password"
          type="password"
        />
      </Form>
    </AuthWrapper>
  );
};

export default SignupForm;
