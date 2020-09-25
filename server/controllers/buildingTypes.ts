import {createBuildingType, BuildingType} from '../models/BuildingType';

export function createBuildingTypes(
  buildingTypes: any[]
): Promise<BuildingType[]> {
  // Use a reducer so that we can coerce our async calls to a set run order
  let firstBuilding = buildingTypes.shift();
  return buildingTypes.reduce(
    (cur, next) => cur.then(() => createBuildingType(next)),
    createBuildingType(firstBuilding)
  );
}
