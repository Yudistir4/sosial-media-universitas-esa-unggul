package router

import (
	"backend/cmd/webservice/apiversioning"
	"backend/cmd/webservice/post/handler"
	"backend/internal/post/service"
	customemiddleware "backend/pkg/middleware/service"
	"backend/pkg/utils/validatorutils"

	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
)

type RouterParams struct {
	E          *echo.Echo
	Service    service.PostService
	Log        *logrus.Entry
	Validator  *validatorutils.Validator
	Middleware customemiddleware.Middleware
}

func InitPostRouter(params RouterParams) {
	postHandler := handler.NewPostHandler(&handler.PostHandlerParams{
		Service:   params.Service,
		Log:       params.Log,
		Validator: params.Validator,
	})

	postV1Group := params.E.Group(apiversioning.APIVersion1 + "/posts")
	postV1Group.POST("", postHandler.CreatePost(params.Service), params.Middleware.UserMustAuthorized())
}