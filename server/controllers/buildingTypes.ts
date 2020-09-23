import {createBuildingType, BuildingType} from '../models/BuildingType';

export function createBuildingTypes(
  buildingTypes: any
): Promise<BuildingType[]> {
  return Promise.all(
    buildingTypes.map((buildingType: any) => {
      return createBuildingType(buildingType);
    })
  );
}
