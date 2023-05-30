package router

import (
	"backend/cmd/webservice/apiversioning"
	"backend/cmd/webservice/user/handler"
	"backend/internal/user/service"
	customemiddleware "backend/pkg/middleware/service"
	"backend/pkg/utils/validatorutils"

	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
)

type RouterParams struct {
	E          *echo.Echo
	Service    service.UserService
	Log        *logrus.Entry
	Validator  *validatorutils.Validator
	Middleware customemiddleware.Middleware
}

func InitUserRouter(params RouterParams) {
	userHandler := handler.NewUserHandler(&handler.UserHandlerParams{
		Service:   params.Service,
		Log:       params.Log,
		Validator: params.Validator,
	})

	userV1Group := params.E.Group(apiversioning.APIVersion1 + "/users")
	userV1Group.GET("", userHandler.GetUsers(params.Service), params.Middleware.UserMustAuthorized())
	userV1Group.POST("", userHandler.CreateUser(params.Service), params.Middleware.UserMustAuthorized())
	userV1Group.GET("/:id", userHandler.GetUserByID(params.Service), params.Middleware.UserMustAuthorized())
	userV1Group.PUT("/:id", userHandler.UpdateUser(params.Service), params.Middleware.UserMustAuthorized())
	userV1Group.PUT("/:id/profile", userHandler.UpdateUserProfile(params.Service), params.Middleware.UserMustAuthorized())
	userV1Group.PUT("/:id/profile-pic", userHandler.UpdateUserProfilePic(params.Service), params.Middleware.UserMustAuthorized())
	userV1Group.DELETE("/:id/profile-pic", userHandler.DeleteUserProfilePic(params.Service), params.Middleware.UserMustAuthorized())
	userV1Group.DELETE("/:id", userHandler.DeleteUser(params.Service), params.Middleware.UserMustAuthorized())
}
