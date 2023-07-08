package handler

import (
	"backend/internal/polling/service"
	"backend/pkg/utils/validatorutils"

	"github.com/sirupsen/logrus"
)

type pollingHandler struct {
	service   service.PollingService
	log       *logrus.Entry
	validator *validatorutils.Validator
}

type PollingHandlerParams struct {
	Service   service.PollingService
	Log       *logrus.Entry
	Validator *validatorutils.Validator
}

func NewPollingHandler(params *PollingHandlerParams) *pollingHandler {
	return &pollingHandler{
		service:   params.Service,
		log:       params.Log,
		validator: params.Validator,
	}
}
