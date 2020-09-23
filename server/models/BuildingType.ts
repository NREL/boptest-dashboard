import {EntitySchema, getRepository} from 'typeorm';

import {Result} from './Result';

export interface BuildingType {
  id: number;
  uid: string;
  name: string;
  parsedHTML: string;
  detailsURL: string;
  results: Result[];
}

export type BuildingTypeData = Omit<BuildingType, 'results'>;

export const BuildingTypeEntity = new EntitySchema<BuildingType>({
  name: 'buildingtypes',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    uid: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    parsedHTML: {
      type: String,
    },
    detailsURL: {
      type: Date,
    },
  },
  relations: {
    results: {
      type: 'one-to-many',
      target: 'results',
      cascade: true,
      inverseSide: 'buildingType',
    },
  },
});

export function createBuildingType(
  data: BuildingTypeData
): Promise<BuildingType> {
  const buildingTypeRepo = getRepository<BuildingType>(BuildingTypeEntity);

  return buildingTypeRepo.save(data);
}

export function getBuildingType(id: string): Promise<BuildingType> {
  const buildingTypeRepo = getRepository<BuildingType>(BuildingTypeEntity);

  return buildingTypeRepo.findOneOrFail(id);
}
