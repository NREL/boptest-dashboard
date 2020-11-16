# BOPTest Dashboard API Documentation:

## Add Results:

POST: `api/results`

### Available query parameters:

- `uid` REQUIRED - String
- `isShared` OPTIONAL - Boolean
- `dateRun` REQUIRED - String
- `account` REQUIRED - Object `{"apiKey": "exampleKey123"}`
- `thermalDiscomfort` REQUIRED - Number
- `energyUse` REQUIRED - Number
- `cost` REQUIRED - Number
- `emissions` REQUIRED - Number
- `iaq` REQUIRED - Number
- `timeRatio` REQUIRED - Number
- `testTimePeriod` REQUIRED - String (Will have an enum for this eventually)
- `controlStep` REQUIRED - String
- `priceScenario` REQUIRED - String
- `weatherForecastUncertainty` REQUIRED - String
- `buildingType` REQUIRED - Object `{"id": 1}`
- `controllerProperties` REQUIRED - Object any valid JSON key value pairs here

### Example Payload:

```json
{
  "results": [
    {
      "uid": "6317d174c593f59c6ed7fc68f500b4fe",
      "isShared": true,
      "dateRun": "2020-08-04T23:00:00.000Z",
      "account": {
        "apiKey": "apiKey"
      },
      "thermalDiscomfort": 6,
      "energyUse": 5,
      "cost": 100,
      "emissions": 19,
      "iaq": 43,
      "timeRatio": 900,
      "testTimePeriod": "Winter",
      "controlStep": "controlStep",
      "priceScenario": "priceScenario",
      "weatherForecastUncertainty": "forecast-unknown",
      "controllerProperties": {
        "controllerType": "controllerType1",
        "problemFormulation": "problem1",
        "modelType": "modelType1",
        "numStates": 15,
        "predictionHorizon": 700
      },
      "buildingType": {
        "id": 2
      }
    }
  ]
}
```

## Add Building Types

POST `api/buildingTypes`

- This endpoint accepts an array of building types. So it can be used to create a single building type or a batch of them depending on how many objects are in the array.

### Available query parameters:

- `uid` REQUIRED - String
- `name` REQUIRED - String
- `pdfURL` REQUIRED - String
- `markdownURL` REQUIRED - String

- Note: The 2 URLs above must be from a trusted source and be the raw version of the git link. See Example Payload below.

### Example Payload:

```json
{
  "buildingTypes": [
    {
      "uid": "13245kasdjfn",
      "name": "Posty Building 3.0",
      // These 2 urls need to be from trusted sources and the raw version of the git link
      "pdfURL": "https://raw.githubusercontent.com/NREL/project1-boptest/master/someFile.pdf",
      "markdownURL": "https://raw.githubusercontent.com/NREL/project1-boptest/master/README.md"
    }
  ]
}
```
