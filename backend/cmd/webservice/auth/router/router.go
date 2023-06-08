package router

import (
	"backend/cmd/webservice/apiversioning"
	"backend/cmd/webservice/auth/handler"
	"backend/internal/auth/service"
	customemiddleware "backend/pkg/middleware/service"
	"backend/pkg/utils/validatorutils"

	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
)

type RouterParams struct {
	E          *echo.Echo
	Service    service.AuthService
	Log        *logrus.Entry
	Validator  *validatorutils.Validator
	Middleware customemiddleware.Middleware
}

func InitAuthRouter(params RouterParams) {
	authHandler := handler.NewAuthHandler(&handler.AuthHandlerParams{
		Service:   params.Service,
		Log:       params.Log,
		Validator: params.Validator,
	})

	authV1Group := params.E.Group(apiversioning.APIVersion1 + "/auths")
	authV1Group.POST("/login", authHandler.Login(params.Service))
	authV1Group.POST("/forgot-password", authHandler.ForgotPasasword(params.Service))
	authV1Group.POST("/reset-password/validate-code", authHandler.ValidateResetPasswordCode(params.Service))
	authV1Group.POST("/reset-password", authHandler.ResetPasswordAfterForgot(params.Service))
	authV1Group.PUT("/reset-password", authHandler.ResetPassword(params.Service), params.Middleware.UserMustAuthorized())
	authV1Group.POST("/refresh", authHandler.RefreshToken(params.Service))
	authV1Group.POST("/change-email", authHandler.ChangeEmail(params.Service), params.Middleware.UserMustAuthorized())
	authV1Group.POST("/verify-email", authHandler.VerifyEmail(params.Service), params.Middleware.UserMustAuthorized())
}
