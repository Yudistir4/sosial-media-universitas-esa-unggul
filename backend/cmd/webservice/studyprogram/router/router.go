package router

import (
	"backend/cmd/webservice/apiversioning"
	"backend/cmd/webservice/studyprogram/handler"
	"backend/internal/studyprogram/service"
	customemiddleware "backend/pkg/middleware/service"
	"backend/pkg/utils/validatorutils"

	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
)

type RouterParams struct {
	E          *echo.Echo
	Service    service.StudyProgramService
	Log        *logrus.Entry
	Validator  *validatorutils.Validator
	Middleware customemiddleware.Middleware
}

func InitStudyProgramRouter(params RouterParams) {
	studyProgramHandler := handler.NewStudyProgramHandler(&handler.StudyProgramHandlerParams{
		Service:   params.Service,
		Log:       params.Log,
		Validator: params.Validator,
	})
	studyprogramV1Group := params.E.Group(apiversioning.APIVersion1 + "/studyprograms")
	studyprogramV1Group.GET("", studyProgramHandler.GetStudyPrograms(params.Service), params.Middleware.UserMustAuthorized())
	studyprogramV1Group.POST("", studyProgramHandler.CreateStudyProgram(params.Service), params.Middleware.UserMustAuthorized())
	studyprogramV1Group.DELETE("/:id", studyProgramHandler.DeleteStudyProgram(params.Service), params.Middleware.UserMustAuthorized())
}
