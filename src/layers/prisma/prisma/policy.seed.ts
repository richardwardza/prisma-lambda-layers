import { EntityState, Prisma } from '@prisma/client';
import {
  createDriverObject,
  createPolicyHolderObject,
  createPolicyObject,
  createPropositionObject,
  createVehicleObject,
} from '../tests/common/policy';

export const createSeedPolicyObject = () => {
  const createdAt = new Date('2021-08-18T12:00:00Z');
  const policyObject = createPolicyObject({
    id: '11111111-1111-1111-1111-111111111111',
    policyNumber: 'P9123456',
    createdAt: createdAt,
    inceptionDate: new Date('2020-08-01'),
    anniversaryDate: new Date('2021-08-01'),
  });
  const propositionOnbject = createPropositionObject({
    pencePerMile: 5.4,
    maxBillableJourneyMileage: 100,
  });
  const policyHolderObject = createPolicyHolderObject({
    title: 'Mr',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: new Date('1988-01-01'),
    emailAddress: 'john.smith@example.com',
    address1: 'Floor 1, Aedis',
    address2: 'Fictional Street',
    address3: 'Wicker',
    address4: 'Sheffield',
    address5: 'South Yorkshire',
    postcode: 'S3 8HQ',
    phoneNumber: '0114 270 1114',
  });
  const vehicleObject = createVehicleObject({
    id: '105af8a9-7d50-4f95-971c-ab5985a71fa6',
    createdAt: createdAt,
    vehicleSlotId: '1',
    vehicleRegistration: 'NK03RKT',
  });
  const driverObject = createDriverObject({
    title: policyHolderObject.title,
    firstName: policyHolderObject.firstName,
    lastName: policyHolderObject.lastName,
    dateOfBirth: policyHolderObject.dateOfBirth,
    emailAddress: policyHolderObject.emailAddress,
  });

  const pdata: Prisma.PolicyCreateInput = {
    ...policyObject,
    entityState: {
      connect: {
        status: EntityState.active,
      },
    },
    policyHolder: {
      create: {
        ...policyHolderObject,
      },
    },
    vehicles: {
      createMany: {
        data: {
          ...vehicleObject,
          entityStatus: EntityState.active,
        },
      },
    },
    drivers: {
      createMany: {
        data: {
          ...driverObject,
          entityStatus: EntityState.active,
        },
      },
    },
    proposition: {
      create: {
        ...propositionOnbject,
      },
    },
  };

  return pdata;
};
