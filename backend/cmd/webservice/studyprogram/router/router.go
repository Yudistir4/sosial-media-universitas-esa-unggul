package router

import (
	"backend/cmd/webservice/apiversioning"
	"backend/cmd/webservice/studyprogram/handler"
	"backend/internal/studyprogram/service"
	"backend/pkg/utils/validatorutils"

	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
)

type RouterParams struct {
	E         *echo.Echo
	Service   service.StudyProgramService
	Log       *logrus.Entry
	Validator *validatorutils.Validator
}

func InitStudyProgramRouter(params RouterParams) {
	studyprogramV1Group := params.E.Group(apiversioning.APIVersion1 + "/studyprograms")
	studyprogramV1Group.GET("", handler.GetStudyPrograms(params.Service))
	studyprogramV1Group.POST("", handler.CreateStudyProgram(params.Service))
	studyprogramV1Group.DELETE("/:id", handler.DeleteStudyProgram(params.Service))
}
