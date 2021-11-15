# BOPTest Dashboard API Documentation:

## Add Result:

POST: `api/results`

### Example Payload:

```json
{
  "results": [
    {
      "uid": "6317d174c593f59c6ed7fc68f500b4fe",
      "dateRun": "2020-08-04T23:00:00.000Z",
      "boptestVersion": "0.1.0",
      "isShared": true,
      "controlStep": "360.0",
      "account": {
        "apiKey": "apiKey"
      },
      "tags": [
        "string1",
        "string2",
        "string3"
      ],
      "kpis": {
        "cost_tot": 21,
        "emis_tot": 17,
        "ener_tot": 29,
        "idis_tot": 444,
        "tdis_tot": 79,
        "time_rat": 1460,
      },
      "forecastParameters": {
        "horizon": 21600.0,
        "interval": 3600.0
      },
      // each scenario key (ex: timePeriod) should be identical to the key for the scenarios object on the results given buildingType
      "scenario": {
        "timePeriod": "heating peak",
        "electricityPrice": "highly dynamic",
        "weatherForecastUncertainty": "deterministic"
      },
      "buildingType": {
        "uid": "buildingType-1"
      }
    }
  ]
}
```

## Add Testcase

POST `api/testcases`

- This endpoint accepts an array of testcase types. So it can be used to create a single testcase type or a batch of them depending on how many objects are in the array.
- A list of the currently valid testcases, and corresponding scenario values is available here https://github.com/ibpsa/project1-boptest/blob/master/testcases/README.md

### Example Payload:

#### Note: the API Key must be one associated with a SUPER_USER email as defined in your environment file.

```json
{
  "buildingTypes": [
    {
      "uid": "buildingType-1",
      "name": "BIG building",
      "markdownURL": "URL_TO_PUBLIC_MARKDOWN_FILE",
      "pdfURL": "URL_TO_PULIC_PDF",
      // these exact scenarios keys should be the keys for a scenario on a result for this buildingType
      "scenarios": {
        "timePeriod": ["cooling peak", "heating peak", "heating typical"],
        "electricityPrice": ["constant", "dynamic", "highly dynamic"],
        "weatherForecastUncertainty": ["deterministic"]
      }
    }
  ],
  "apiKey": "API_KEY_FROM_WEB_APP"
}
```

## Update Testcase

PATCH `/api/testcases?uid={your_testcase_uid}`

- Though like the `POST` request, the testcase is wrapped in an array of `testcases`, you may only PATCH one testcase at a time. THE `uid` is specified as a query parameter.

```json
{
  "buildingTypes": [
    {
      "name": "BIG building",
      "markdownURL": "URL_TO_PUBLIC_MARKDOWN_FILE",
      "pdfURL": "URL_TO_PULIC_PDF",
      "scenarios": {
        "timePeriod": ["cooling peak", "heating peak", "heating typical"],
        "electricityPrice": ["constant", "dynamic", "highly dynamic"],
        "weatherForecastUncertainty": ["deterministic"],
        // new keys can be added, old results will not be affected, but new results will require that key in it's scenario
        "airQuality": ["smoky"]
      }
    }
  ],
  "apiKey": "API_KEY_FROM_WEB_APP"
}
```
