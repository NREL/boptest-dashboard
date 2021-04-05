# BOPTest Dashboard API Documentation:

## Add Result:

POST: `api/results`

### Example Payload:

```json
{
  "results": [
    {
      "uid": "6317d174c593f59c6ed7fc68f500b4fe",
      "isShared": true,
      "dateRun": "2020-08-04T23:00:00.000Z",
      "account": {
        "apiKey": "API_KEY_FROM_WEB_APP"
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

## Add Building

POST `api/buildingTypes`

- This endpoint accepts an array of building types. So it can be used to create a single building type or a batch of them depending on how many objects are in the array.

### Example Payload:

#### Note: the API Key must be one associated with a SUPER_USER email as defined in your environment file.

```json
{{
    "buildingTypes": [
        {
            "uid": "two",
            "name": "Other Large Building",
            "pdfURL": "URL_TO_PULIC_PDF",
            "markdownURL": "URL_TO_PUBLIC_MARKDOWN_FILE"
        }
    ],
    "apiKey": "SU_API_KEY"
}
```

## Update Building

PATCH `/api/buildingTypes?uid={your_build_uid}`

- Though like the `POST` request, the building is wrapped in an array of `buildingTypes`, you may only PATCH one building at a time. THE `uid` is specified as a query parameter.

```json
{
    "buildingTypes": [
        {
            "name": "Building awesome",
            "pdfURL": "https://github.com/p-gonzo/test-building-types/raw/main/building_type_test_files/List%20of%20building%20types%20-%20Wikipedia.pdf",
            "markdownURL": "https://raw.githubusercontent.com/p-gonzo/test-building-types/main/building_type_test_files/bigBuilding.md"
        }
    ],
    "apiKey": "SU API KEY"
}
```