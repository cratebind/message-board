import { Ctx } from 'blitz';
import { authenticateUser } from 'app/auth/auth-utils';
import { LoginInput, LoginInputType } from '../validations';

export default async function login(input: LoginInputType, { session }: Ctx) {
  // This throws an error if input is invalid
  const { username, password } = LoginInput.parse(input);

  // This throws an error if credentials are invalid
  const user = await authenticateUser(username, password);

  await session.create({ userId: user.id, roles: [user.role] });

  return user;
}
