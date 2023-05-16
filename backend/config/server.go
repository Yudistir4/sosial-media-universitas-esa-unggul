package config

import (
	"fmt"
	"log"
	"strconv"

	"github.com/labstack/echo/v4"
)

type Server struct {
	E                    *echo.Echo
	Port                 string `validate:"required"`
	Environment          string `validate:"oneof='dev' 'prod'"`
	WhiteListAllowOrigin string `validate:"required"`
}

func StartServer(param *Server) error {
	port, err := strconv.Atoi(param.Port)
	if err != nil {
		log.Println("[ERROR] Error while convert port to number:", err.Error())
		return err
	}

	param.E.Start(fmt.Sprintf(":%d", port))
	return nil
}
