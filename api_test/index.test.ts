import axios from "axios";

const accountEndpoint = `http://${process.env.SERVER_HOST}:8080/api/setup/account`;
const resultsEndpoint = `http://${process.env.SERVER_HOST}:8080/api/results`;
const buildingTypesEndpoint = `http://${process.env.SERVER_HOST}:8080/api/setup/buildingTypes`;
const dummyEndpoint = `http://${process.env.SERVER_HOST}:8080/api/accounts/dummy`;
const accountsEndpoint = `http://${process.env.SERVER_HOST}:8080/api/accounts`;

const accountsPayload = [
  {
    apiKey: "jerrysapikey",
    email: "jerbear@gmail.com",
    name: "Jerry",
  },
  {
    apiKey: "carlsapikey",
    email: "badcarl@gmail.com",
    name: "Carl",
  },
  {
    apiKey: "tedsapikey",
    email: "teddybare@gmail.com",
    name: "Ted",
  },
];

const readmeUrl =
  "https://raw.githubusercontent.com/NREL/project1-boptest/master/README.md";

const buildingTypesPayload = {
  buildingTypes: [
    {
      id: 1,
      uid: "buildingType-1",
      name: "BIG building",
      markdownURL: readmeUrl,
      pdfURL: readmeUrl,
    },
    {
      id: 2,
      uid: "buildingType-2",
      name: "small building",
      markdownURL: readmeUrl,
      pdfURL: readmeUrl,
    },
  ],
};

const resultPayload = {
  results: [
    {
      dateRun: "2020-08-04T23:00:00.000Z",
      isShared: true,
      uid: "result1",
      account: {
        apiKey: "jerrysapikey",
      },
      thermalDiscomfort: 6,
      energyUse: 5,
      cost: 100,
      emissions: 19,
      iaq: 43,
      timeRatio: 900,
      testTimePeriod: "Summer",
      controlStep: "controlStep",
      priceScenario: "priceScenario",
      weatherForecastUncertainty: "forecast-unknown",
      controllerProperties: {
        controllerType: "controllerType1",
        problemFormulation: "problem1",
        modelType: "modelType1",
        numStates: 15,
        predictionHorizon: 700,
      },
      buildingType: buildingTypesPayload.buildingTypes[0],
    },
    {
      dateRun: "2020-08-04T23:00:00.000Z",
      isShared: true,
      uid: "result2",
      account: {
        apiKey: "tedsapikey",
      },
      thermalDiscomfort: 62,
      energyUse: 15,
      cost: 12,
      emissions: 11,
      iaq: 430,
      timeRatio: 1200,
      testTimePeriod: "Winter",
      controlStep: "controlStep",
      priceScenario: "priceScenario",
      weatherForecastUncertainty: "forecast-unknown",
      controllerProperties: {
        controllerType: "controllerType2",
        problemFormulation: "problem2",
        modelType: "modelType2",
        numStates: 25,
        predictionHorizon: 8000,
      },
      buildingType: buildingTypesPayload.buildingTypes[1],
    },
    {
      dateRun: "2020-08-04T23:00:00.000Z",
      isShared: true,
      uid: "result3",
      account: {
        apiKey: "tedsapikey",
      },
      thermalDiscomfort: 12,
      energyUse: 35,
      cost: 6,
      emissions: 190,
      iaq: 40,
      timeRatio: 10,
      testTimePeriod: "Winter",
      controlStep: "controlStep",
      priceScenario: "priceScenario",
      weatherForecastUncertainty: "forecast-unknown",
      controllerProperties: {
        controllerType: "controllerType2",
        problemFormulation: "problem2",
        modelType: "modelType2",
        numStates: 25,
        predictionHorizon: 8000,
      },
      buildingType: buildingTypesPayload.buildingTypes[1],
    },
    {
      dateRun: "2020-08-04T23:00:00.000Z",
      isShared: true,
      uid: "result4",
      account: {
        apiKey: "tedsapikey",
      },
      thermalDiscomfort: 3,
      energyUse: 1500,
      cost: 67,
      emissions: 1249,
      iaq: 55,
      timeRatio: 100,
      testTimePeriod: "Winter",
      controlStep: "controlStep",
      priceScenario: "priceScenario",
      weatherForecastUncertainty: "forecast-unknown",
      controllerProperties: {
        controllerType: "controllerType2",
        problemFormulation: "problem2",
        modelType: "modelType2",
        numStates: 25,
        predictionHorizon: 8000,
      },
      buildingType: buildingTypesPayload.buildingTypes[1],
    },
    {
      dateRun: "2020-08-04T23:00:00.000Z",
      isShared: true,
      uid: "result5",
      account: {
        apiKey: "tedsapikey",
      },
      thermalDiscomfort: 62,
      energyUse: 15,
      cost: 12,
      emissions: 11,
      iaq: 430,
      timeRatio: 1200,
      testTimePeriod: "Winter",
      controlStep: "controlStep",
      priceScenario: "priceScenario",
      weatherForecastUncertainty: "definitely-known-forecast",
      controllerProperties: {
        controllerType: "controllerType2",
        problemFormulation: "problem2",
        modelType: "modelType2",
        numStates: 25,
        predictionHorizon: 8000,
      },
      buildingType: buildingTypesPayload.buildingTypes[1],
    },
  ],
};

describe("Main", () => {
  beforeAll((done) => {
    return axios
      .post(accountEndpoint, accountsPayload)
      .then(() => {
        return axios.post(buildingTypesEndpoint, buildingTypesPayload);
      })
      .then(() => {
        return axios.post(resultsEndpoint, resultPayload);
      })
      .then(() => done());
  });

  test("dummy endpoint should be reachable", () => {
    return axios.get(dummyEndpoint).then((res) => {
      expect(res.status).toEqual(200);
    });
  });

  test("accounts endpoint should be reachable", () => {
    return axios.get(accountsEndpoint).then((res) => {
      expect(res.status).toEqual(200);
    });
  });
  test("accounts should be returned properly", () => {
    return axios.get(accountsEndpoint).then((res) => {
      expect(res.data.length).toEqual(3);

      const jerrysAccount = res.data.filter(
        (account) => account.name === "Jerry"
      )[0];

      expect(jerrysAccount["apiKey"]).toEqual("jerrysapikey");
      expect(jerrysAccount["email"]).toEqual("jerbear@gmail.com");
      expect(jerrysAccount["results"][0]["uid"]).toEqual("result1");
    });
  });

  test("results endpoint should be reachable", () => {
    return axios.get(resultsEndpoint).then((res) => {
      expect(res.status).toEqual(200);
    });
  });
  test("results should be returned properly", () => {
    return axios.get(resultsEndpoint).then((res) => {
      expect(res.data.length).toEqual(5);

      const result = res.data.filter((result) => result.uid === "result2")[0];

      expect(result["account"]["apiKey"]).toEqual("tedsapikey");
      expect(result["cost"]).toEqual(12);
      expect(result["buildingType"]["uid"]).toEqual("buildingType-2");
      expect(result["controllerProperties"]["numStates"]).toEqual(25);
    });
  });
  test("result signature details should only return details for results with a similar signature", () => {
    // this has no signature matches, so it should have 1 result returned
    const result1SignatureEndpoint = `http://${process.env.SERVER_HOST}:8080/api/results/result1/signature`;

    return axios.get(result1SignatureEndpoint).then((res) => {
      expect(res.data.numResults).toEqual(1);
    });
  });
  test("result signature details returns matches when signatures are the same", () => {
    // this has 2 signature matches for a total of 3 results returned
    const result2SignatureEndpoint = `http://${process.env.SERVER_HOST}:8080/api/results/result2/signature`;
    const expectedResults = {
      numResults: 3,
      thermalDiscomfort: { min: 3, max: 62 },
      energyUse: { min: 15, max: 1500 },
      cost: { min: 6, max: 67 },
      emissions: { min: 11, max: 1249 },
      iaq: { min: 40, max: 430 },
      timeRatio: { min: 10, max: 1200 },
    };

    return axios.get(result2SignatureEndpoint).then((res) => {
      expect(res.data.numResults).toEqual(3);
      expect(res.data).toEqual(expectedResults);
    });
  });
  test("result signature details that are close but not a match will only return exact matches", () => {
    // this one is very close to results 2-4, but has a different weather uncertainty, so only 1 result returned again
    const result5SignatureEndpoint = `http://${process.env.SERVER_HOST}:8080/api/results/result5/signature`;

    return axios.get(result5SignatureEndpoint).then((res) => {
      expect(res.data.numResults).toEqual(1);
    });
  });
});
