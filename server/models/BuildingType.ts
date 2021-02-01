import {EntitySchema, getRepository} from 'typeorm';
import axios from 'axios';

import {BuildingType} from '../../common/interfaces';

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
    markdown: {
      type: String,
      nullable: true,
    },
    markdownURL: {
      type: String,
    },
    pdfURL: {
      type: String,
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
  return axios.get(data.markdownURL).then(res => {
    data.markdown = res.data;
    return buildingTypeRepo.save(data);
  });
}

export function getBuildingTypes(): Promise<BuildingType[]> {
  const repo = getRepository<BuildingType>(BuildingTypeEntity);
  return repo.find();
}

export function getBuildingType(id: number): Promise<BuildingType> {
  const buildingTypeRepo = getRepository<BuildingType>(BuildingTypeEntity);
  return buildingTypeRepo.findOneOrFail(id);
}
