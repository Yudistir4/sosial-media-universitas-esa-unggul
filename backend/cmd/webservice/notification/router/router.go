package router

import (
	"backend/cmd/webservice/apiversioning"
	"backend/cmd/webservice/notification/handler"
	"backend/internal/notification/service"
	customemiddleware "backend/pkg/middleware/service"
	"backend/pkg/utils/validatorutils"

	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
)

type RouterParams struct {
	E          *echo.Echo
	Service    service.NotificationService
	Log        *logrus.Entry
	Validator  *validatorutils.Validator
	Middleware customemiddleware.Middleware
}

func InitNotificationRouter(params RouterParams) {
	notificationHandler := handler.NewNotificationHandler(&handler.NotificationHandlerParams{
		Service:   params.Service,
		Log:       params.Log,
		Validator: params.Validator,
	})

	notificationV1Group := params.E.Group(apiversioning.APIVersion1 + "/notifications")
	notificationV1Group.GET("", notificationHandler.GetNotifications(params.Service), params.Middleware.UserMustAuthorized())
	notificationV1Group.GET("/total", notificationHandler.GetTotalUnreadNotifications(params.Service), params.Middleware.UserMustAuthorized())
	notificationV1Group.PATCH("/read", notificationHandler.MarkNotificationsAsRead(params.Service), params.Middleware.UserMustAuthorized())
}
