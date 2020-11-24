import {EntitySchema, getRepository} from 'typeorm';
import axios from 'axios';

import {BuildingType} from '../../common/interfaces';

const TRUSTED_SOURCES = [
  'https://github.com/NREL/boptest-dashboard',
  'https://raw.githubusercontent.com/NREL/project1-boptest/master',
  'https://raw.githubusercontent.com/p-gonzo/',
  'https://github.com/p-gonzo/'
];

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
  if (!urlIsFromTrustedSource(data.markdownURL) || !urlIsFromTrustedSource(data.pdfURL)) {
    throw new Error('The URLs are not from a trusted source.');
  }
  const buildingTypeRepo = getRepository<BuildingType>(BuildingTypeEntity);

  // need to get the markdown from the markdownURL, then save the new buildingType
  return axios.get(data.markdownURL).then(res => {
    data.markdown = res.data;
    return buildingTypeRepo.save(data);
  });
}

export function getBuildingTypes(): Promise<BuildingType[]> {
  const repo = getRepository<BuildingType>(BuildingTypeEntity);

  return repo.find();
}

function urlIsFromTrustedSource(url: String): Boolean {
  for (let i = 0 ; i < TRUSTED_SOURCES.length; i++) {
    if (url.startsWith(TRUSTED_SOURCES[i])) { return true; }
  }
  return false;
}

export function getBuildingType(id: number): Promise<BuildingType> {
  const buildingTypeRepo = getRepository<BuildingType>(BuildingTypeEntity);

  return buildingTypeRepo.findOneOrFail(id);
}
