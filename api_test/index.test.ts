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
    password: "jerryspass",
  },
  {
    apiKey: "carlsapikey",
    email: "badcarl@gmail.com",
    name: "Carl",
    password: "carlspass",
  },
  {
    apiKey: "tedsapikey",
    email: "teddybare@gmail.com",
    name: "Ted",
    password: "tedspass",
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
      testTimePeriodStart: new Date(),
      testTimePeriodEnd: new Date(),
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
      testTimePeriodStart: new Date(),
      testTimePeriodEnd: new Date(),
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
      expect(jerrysAccount["password"]).toEqual("jerryspass");
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
      expect(res.data.length).toEqual(2);

      const result = res.data.filter((result) => result.uid === "result2")[0];

      expect(result["account"]["apiKey"]).toEqual("tedsapikey");
      expect(result["cost"]).toEqual(12);
      expect(result["buildingType"]["uid"]).toEqual("buildingType-2");
      expect(result["controllerProperties"]["numStates"]).toEqual(25);
    });
  });
});
