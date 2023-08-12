package handler

import (
	"backend/internal/conversation/service"
	"backend/pkg/utils/validatorutils"

	"github.com/sirupsen/logrus"
)

type conversationHandler struct {
	service   service.ConversationService
	log       *logrus.Entry
	validator *validatorutils.Validator
}

type ConversationHandlerParams struct {
	Service   service.ConversationService
	Log       *logrus.Entry
	Validator *validatorutils.Validator
}

func NewConversationHandler(params *ConversationHandlerParams) *conversationHandler {
	return &conversationHandler{
		service:   params.Service,
		log:       params.Log,
		validator: params.Validator,
	}
}
