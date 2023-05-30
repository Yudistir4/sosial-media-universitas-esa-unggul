package handler

import (
	"backend/internal/user/service"
	"backend/pkg/utils/validatorutils"

	"github.com/sirupsen/logrus"
)

type userHandler struct {
	service   service.UserService
	log       *logrus.Entry
	validator *validatorutils.Validator
}

type UserHandlerParams struct {
	Service   service.UserService
	Log       *logrus.Entry
	Validator *validatorutils.Validator
}

func NewUserHandler(params *UserHandlerParams) *userHandler {
	return &userHandler{
		service:   params.Service,
		log:       params.Log,
		validator: params.Validator,
	}
}
