package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	fmt.Println("Hello world")

	url := "http://localhost:8080/api/results"
	fmt.Println("URL:", url)

	var payload = []byte(`{
		"results": [
			{
				"dateRun": "2020-08-04T23:00:00.000Z",
				"isShared": true,
				"account": {
					"name": "Bill",
					"email": "bill@gmail.com",
					"apiKey": "apiKey"
				},
				"kpi": {
					"thermalDiscomfort": 6,
					"energyUse": 5,
					"cost": 100,
					"emissions": 19,
					"iaq": 43,
					"timeRatio": 900
				},
				"testcase": {
					"name": "testcase",
					"cosimulationStart": "2020-08-04T23:00:00.000Z",
					"cosimulationEnd": "2020-08-04T23:10:00.000Z",
					"controlStep": "control",
					"priceScenario": "price",
					"uncertaintyDist": "uncertain",
					"buildingType": "building1"
				}
			}
		]
	}`)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	fmt.Println("response Status:", resp.Status)
	fmt.Println("response Headers:", resp.Header)
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("response Body:", string(body))
}
