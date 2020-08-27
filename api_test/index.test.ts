import axios from "axios";

const accountEndpoint = `http://${process.env.SERVER_HOST}:8080/api/setup/account`;
const resultsEndpoint = `http://${process.env.SERVER_HOST}:8080/api/results`;
const testcaseEndpoint = `http://${process.env.SERVER_HOST}:8080/api/setup/testcase`;
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

const testcasePayload = {
  testcase: {
    name: "testcase",
    uid: "testcase1",
    cosimulationStart: "2020-08-04T23:00:00.000Z",
    cosimulationEnd: "2020-08-04T23:10:00.000Z",
    controlStep: "control",
    priceScenario: "price",
    uncertaintyDist: "uncertain",
    buildingType: "building1",
  },
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
      kpi: {
        thermalDiscomfort: 6,
        energyUse: 5,
        cost: 100,
        emissions: 19,
        iaq: 43,
        timeRatio: 900,
      },
      testcase: {
        uid: "testcase1",
      },
    },
    {
      dateRun: "2020-08-04T23:00:00.000Z",
      isShared: true,
      uid: "result2",
      account: {
        apiKey: "tedsapikey",
      },
      kpi: {
        thermalDiscomfort: 62,
        energyUse: 15,
        cost: 12,
        emissions: 11,
        iaq: 430,
        timeRatio: 1200,
      },
      testcase: {
        uid: "testcase1",
      },
      tags: {
        numStates: 6,
        controllerType: "controller-big",
      },
    },
  ],
};

describe('Main', () => {
  beforeAll(done => {
    let accountData: any;
    let testCaseData: any;
    return axios.post(accountEndpoint, accountsPayload)
      .then(res => {
        accountData = res.data;
        return axios.post(testcaseEndpoint, testcasePayload)
      })
      .then(res => {
        testCaseData = res.data;
        return axios.post(resultsEndpoint, resultPayload)
      })
      .then(() => done());
  });

  test("dummy endpoint should be reachable", () => {
    axios.get(dummyEndpoint).then((res) => {
      expect(res.status).toEqual(200);
    });
  });

  test("accounts endpoint should be reachable", () => {
    axios.get(accountsEndpoint).then((res) => {
      expect(res.status).toEqual(200);
    });
  });
  test("accounts should be returned properly", () => {
    axios.get(accountsEndpoint).then((res) => {
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
    axios.get(resultsEndpoint).then((res) => {
      expect(res.status).toEqual(200);
    });;
  });
  test("results should be returned properly", () => {
    axios.get(resultsEndpoint).then((res) => {
      
      expect(res.data.length).toEqual(2);

      const result = res.data.filter((result) => result.uid === "result2")[0];

      expect(result["account"]["apiKey"]).toEqual("tedsapikey");
      expect(result["kpi"]["cost"]).toEqual(12);
      expect(result["testcase"]["uid"]).toEqual("testcase1");
      expect(result["tags"]["numStates"]).toEqual(6);
    });

  });

});