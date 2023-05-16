package main

import (
	"backend/cmd/webservice"
	"backend/config"
	"backend/pkg/utils/logrusutils"
	"log"
)

func main() {
	config, err := config.GetConfig("./.env")
	if err != nil {
		log.Fatal(err)
	}

	log := logrusutils.New()

	webservice.InitWebservice(&webservice.WebserviceParams{
		Log: log, Config: config,
	})

}
