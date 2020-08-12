package main

import (
	"fmt"
	"net/http"
	"os"
	"testing"
)

func TestDummyEndpoint(t *testing.T) {
	host := os.Getenv("SERVER_HOST")
	fmt.Printf("host for this envar is: %s\n", host)
	endpoint := fmt.Sprintf("http://%s:8080/api/accounts/dummy", host)
	resp, err := http.Get(endpoint)
	if err != nil {
		t.Errorf("Unable to get the dummy endpoint %v", err)
	}

	if resp.StatusCode != 200 {
		t.Errorf("Expected status code of 200, got %d", resp.StatusCode)
	}

	t.Log("Ran the test dummy endpoint test")
	// if resp.StatusCode != 400 {
	// 	t.Errorf("Expected status code of 400, got %d", resp.StatusCode)
	// }

}
