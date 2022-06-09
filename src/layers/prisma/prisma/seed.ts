import { PrismaClient } from '@prisma/client';
import { createSeedPolicyObject } from './policy.seed';

const prisma = new PrismaClient();

async function seed() {
  await prisma.entityStatus.createMany({
    data: [
      {
        status: 'active',
        clientLabel: 'Active',
      },
      {
        status: 'inactive',
        clientLabel: 'Inactive',
      },
    ],
  });

  const policyObject = createSeedPolicyObject();
  await prisma.policy.create({ data: policyObject });

  process.exit(0);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("We're all done!");
    await prisma.$disconnect();
  });
