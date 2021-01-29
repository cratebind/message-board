import React from 'react';
import { useRouter, BlitzPage, useQuery } from 'blitz';
import Layout from 'app/layouts/Layout';
import { SignupForm } from 'app/auth/components/SignupForm';
import getCurrentUser from 'app/users/queries/getCurrentUser';

const SignupPage: BlitzPage = () => {
  const router = useRouter();
  const [, { refetch }] = useQuery(getCurrentUser, null, {
    suspense: false,
  });

  return (
    <div>
      <SignupForm
        onSuccess={async () => {
          await refetch();
          router.push('/');
        }}
      />
    </div>
  );
};

SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>;

export default SignupPage;
