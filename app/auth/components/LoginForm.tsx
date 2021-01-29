import React from 'react';
import { AuthenticationError, Link, useMutation } from 'blitz';
import { LabeledTextField } from 'app/components/LabeledTextField';
import { Form, FORM_ERROR } from 'app/components/Form';
import login from 'app/auth/mutations/login';
import { LoginInput } from 'app/auth/validations';
import { Box, Flex } from 'minerva-ui';

type LoginFormProps = {
  onSuccess?: () => void;
};

export const AuthWrapper = ({ children, ...props }) => (
  <Flex minH="60vh" width="100%" alignItems="center" justifyContent="center">
    <Box width="100%" maxW="400px">
      {children}
    </Box>
  </Flex>
);

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login);

  return (
    <AuthWrapper>
      <Form
        submitText="Login"
        schema={LoginInput}
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values) => {
          try {
            await loginMutation(values);
            props.onSuccess?.();
          } catch (error) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: 'Sorry, those credentials are invalid' };
            } else {
              return {
                [FORM_ERROR]:
                  'Sorry, we had an unexpected error. Please try again. - ' +
                  error.toString(),
              };
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

      <div style={{ marginTop: '1rem', textDecoration: 'underline' }}>
        <Link href="/signup">Sign Up</Link>
      </div>
    </AuthWrapper>
  );
};

export default LoginForm;
