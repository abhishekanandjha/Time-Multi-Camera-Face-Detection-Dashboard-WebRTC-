import { createUser, findUserByUsername } from './services/auth.service';

async function main() {
  const username = 'admin';
  const password = 'password123';
  const existing = await findUserByUsername(username);
  if (existing) {
    console.log('Admin already exists');
    return;
  }
  const user = await createUser(username, password);
  console.log('Created admin user:', user.username, 'password:', password);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });