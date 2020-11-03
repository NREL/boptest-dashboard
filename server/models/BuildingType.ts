import {buildingTypeRouter} from './../routes/buildingTypeRoutes';
import {EntitySchema, getRepository} from 'typeorm';
import axios from 'axios';

import {Result} from './Result';

const TRUSTED_SOURCES = [
  'https://github.com/NREL/boptest-dashboard',
  'https://raw.githubusercontent.com/NREL/project1-boptest/master',
];

export interface BuildingType {
  id: number;
  uid: string;
  name: string;
  markdown: string | null;
  markdownURL: string;
  pdfURL: string;
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
  // need to check both URLs to make sure they're from a trusted source
  if (!fromTrustedSource(data)) {
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

// this method tells us if the URLs given are from trusted sources
function fromTrustedSource(data: BuildingTypeData): Boolean {
  if (
    !data.markdownURL.startsWith(TRUSTED_SOURCES[0]) &&
    !data.markdownURL.startsWith(TRUSTED_SOURCES[1]) &&
    !data.pdfURL.startsWith(TRUSTED_SOURCES[0]) &&
    !data.pdfURL.startsWith(TRUSTED_SOURCES[1])
  ) {
    return false;
  }

  return true;
}

export function getBuildingType(id: number): Promise<BuildingType> {
  const buildingTypeRepo = getRepository<BuildingType>(BuildingTypeEntity);

  return buildingTypeRepo.findOneOrFail(id);
}
