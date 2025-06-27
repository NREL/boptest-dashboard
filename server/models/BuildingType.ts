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
    scenarios: {
      type: 'jsonb',
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

export function updateBuildingType(
  building: BuildingType, newData: BuildingTypeData, 
): Promise<BuildingType> {
  const buildingTypeRepo = getRepository<BuildingType>(BuildingTypeEntity);
  return axios.get(newData.markdownURL).then(res => {
    building.markdown = res.data;
    building.markdownURL = newData.markdownURL;
    building.name = newData.name;
    building.pdfURL = newData.pdfURL;
    building.scenarios = newData.scenarios;
    return buildingTypeRepo.save(building);
  });
}

export function getBuildingTypes(): Promise<BuildingType[]> {
  const repo = getRepository<BuildingType>(BuildingTypeEntity);
  return repo.find();
}

export function getBuildingTypeByUid(uid: string): Promise<BuildingType> {
  const buildingTypeRepo = getRepository<BuildingType>(BuildingTypeEntity);
  console.log(`Looking up building type with UID: ${uid}`);
  return buildingTypeRepo.findOneOrFail({ uid: uid })
    .then(buildingType => {
      console.log(`Found building type: ${buildingType.name} (${buildingType.uid})`);
      return buildingType;
    })
    .catch(err => {
      console.error(`Failed to find building type with UID ${uid}:`, err);
      throw err;
    });
}
