package handler

import (
	"backend/internal/studyprogram/service"
	"backend/pkg/utils/validatorutils"

	"github.com/sirupsen/logrus"
)

type studyProgramHandler struct {
	service   service.StudyProgramService
	log       *logrus.Entry
	validator *validatorutils.Validator
}

type StudyProgramHandlerParams struct {
	Service   service.StudyProgramService
	Log       *logrus.Entry
	Validator *validatorutils.Validator
}

func NewStudyProgramHandler(params *StudyProgramHandlerParams) *studyProgramHandler {
	return &studyProgramHandler{
		service:   params.Service,
		log:       params.Log,
		validator: params.Validator,
	}
}
