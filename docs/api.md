# BOPTest Dashboard API Documentation:

## Add Result:

POST: `api/results`

- This endpoint accepts an array of results. So it can be used to create a single result or a batch of them depending on how many objects are in the array.
- This endpoint will return a status `400` if any result in the array is rejected. Fulfilled results will still be added to the database even if there are rejected results. To tell which results were fulfilled and which were rejected look at the following path in the response: `{response: {data: {fulfilled: [], rejected: []}}}`

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
      // each scenario key (ex: timePeriod) should match the keys you plan to filter on
      "scenario": {
        "timePeriod": "heating peak",
        "electricityPrice": "highly dynamic",
        "weatherForecastUncertainty": "deterministic"
      },
      "buildingType": {
        "uid": "buildingType-1",
        "name": "Small Office"
      }
    }
  ]
}
```
