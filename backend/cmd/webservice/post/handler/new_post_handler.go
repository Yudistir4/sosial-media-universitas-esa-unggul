package handler

import (
	"backend/internal/post/service"
	"backend/pkg/utils/validatorutils"

	"github.com/sirupsen/logrus"
)

type postHandler struct {
	service   service.PostService
	log       *logrus.Entry
	validator *validatorutils.Validator
}

type PostHandlerParams struct {
	Service   service.PostService
	Log       *logrus.Entry
	Validator *validatorutils.Validator
}

func NewPostHandler(params *PostHandlerParams) *postHandler {
	return &postHandler{
		service:   params.Service,
		log:       params.Log,
		validator: params.Validator,
	}
}
