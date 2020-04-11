import { getRepositoryToken } from "@nestjs/typeorm";

// Mock repository providers
export const mockProviders = (klasses: any[]) =>
  klasses.map(item => ({
    provide: getRepositoryToken(item),
    useValue: {
      find: () => [],
      findOne: () => ({}),
      count: () => 0,
      create: () => ({}),
      findAndCount: () => ({}),
      save: () => ({}),
      createQueryBuilder: () => ({
        where: () => ({
          getOne: () => ({}),
        }),
        loadAllRelationIds: () => ({}),
      }),
      findOneOrFail: () => ({}),
      findByIds: () => [],
    },
  }));
