import 'dotenv/config';
import bcrypt from 'bcrypt';
import { db } from './db';
import { users } from './schema';

const ADMIN_EMAIL = 'dozent@admin.de';
const ADMIN_PASSWORD = '123456';

export async function seedAdminAccount() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await db
    .insert(users)
    .values({ email: ADMIN_EMAIL, passwordHash, role: 'admin' })
    .onConflictDoUpdate({
      target: users.email,
      set: { passwordHash, role: 'admin' },
    });

  console.log(`Seeded admin account: ${ADMIN_EMAIL}`);
}

if (require.main === module) {
  seedAdminAccount()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
