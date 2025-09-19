import {createBuildingType} from '../models/BuildingType';
import {BuildingType} from '../../common/interfaces';

export function createBuildingTypes(
  buildingTypes: any[]
): Promise<BuildingType[]> {
  if (!buildingTypes || buildingTypes.length === 0) {
    return Promise.resolve([]);
  }

  return Promise.all(buildingTypes.map(bt => createBuildingType(bt)));
}
