package router

import (
	"backend/cmd/webservice/apiversioning"
	"backend/cmd/webservice/user/handler"
	"backend/internal/user/service"
	"backend/pkg/utils/validatorutils"

	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
)

type RouterParams struct {
	E         *echo.Echo
	Service   service.UserService
	Log       *logrus.Entry
	Validator *validatorutils.Validator
}

func InitUserRouter(params RouterParams) {
	userV1Group := params.E.Group(apiversioning.APIVersion1 + "/users")
	userV1Group.GET("", handler.GetUsers(params.Service))
	userV1Group.POST("", handler.CreateUser(params.Service))
}
