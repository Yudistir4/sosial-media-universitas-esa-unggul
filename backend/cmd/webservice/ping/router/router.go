package router

import (
	"backend/cmd/webservice/apiversioning"
	"backend/cmd/webservice/ping/handler"
	"backend/internal/ping/service"

	"github.com/labstack/echo/v4"
)

type RouterParams struct {
	E           *echo.Echo
	PingService service.PingService
}

func InitPingRouter(params RouterParams) {
	pingV1Group := params.E.Group(apiversioning.APIVersion1 + "/ping")
	pingV1Group.GET("", handler.PingHandler(params.PingService))
}
