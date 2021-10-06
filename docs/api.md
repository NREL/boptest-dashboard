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
        "cost_tot": 0.7025804273828494,
        "emis_tot": 0.4612590709883337,
        "ener_tot": 2.762030365199603,
        "idis_tot": 0.0,
        "tdis_tot": 19.214004362870106,
        "time_rat": 2.4704477435639305e-05
      },
      "forecastParameters": {
        "horizon": 21600.0,
        "interval": 3600.0
      },
      "scenario": {
        "electricityPrice": "constant",
        "timePeriod": "peak_heat_day"
      },
      "testcase": {
        "id": "bestest_air"
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
  "testcases": [
    {
      "id": "bestest_air",
      "name": "BESTEST Air",
      "scenarios" : {
        "validElectricityPrices": ["constant", "dynamic", "highly_dynamic"],
        "validTimePeriods": ["peak_heat_day", "typical_heat_day", "peak_cool_day", "typical_cool_day", "mix_day"]
      },
      "pdfURL": "https://raw.githubusercontent.com/NREL/project1-boptest/master/someFile.pdf",
      "markdownURL": "https://raw.githubusercontent.com/NREL/project1-boptest/master/README.md"
    }
  ],
  "apiKey": "SU_API_KEY"
}
```

## Update Testcase

PATCH `/api/testcases?uid={your_testcase_uid}`

- Though like the `POST` request, the testcase is wrapped in an array of `testcases`, you may only PATCH one testcase at a time. THE `uid` is specified as a query parameter.

```json
{
  "testcases": [
    {
      "id": "bestest_air",
      "name": "BESTEST Air",
      "scenarios": {
        "validElectricityPrices": ["constant", "dynamic", "highly_dynamic"],
        "validTimePeriods": ["peak_heat_day", "typical_heat_day", "peak_cool_day", "typical_cool_day", "mix_day"]
      },
      "pdfURL": "https://raw.githubusercontent.com/NREL/project1-boptest/master/someFile.pdf",
      "markdownURL": "https://raw.githubusercontent.com/NREL/project1-boptest/master/README.md"
    }
  ],
  "apiKey": "SU_API_KEY"
}
```
