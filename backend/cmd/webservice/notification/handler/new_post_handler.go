package handler

import (
	"backend/internal/notification/service"
	"backend/pkg/utils/validatorutils"

	"github.com/sirupsen/logrus"
)

type notificationHandler struct {
	service   service.NotificationService
	log       *logrus.Entry
	validator *validatorutils.Validator
}

type NotificationHandlerParams struct {
	Service   service.NotificationService
	Log       *logrus.Entry
	Validator *validatorutils.Validator
}

func NewNotificationHandler(params *NotificationHandlerParams) *notificationHandler {
	return &notificationHandler{
		service:   params.Service,
		log:       params.Log,
		validator: params.Validator,
	}
}
