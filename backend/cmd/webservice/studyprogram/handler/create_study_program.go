package handler

import (
	"backend/internal/studyprogram/service"
	"backend/pkg/dto"
	"backend/pkg/utils/httputils"

	customerrors "backend/pkg/errors"

	"github.com/labstack/echo/v4"
)

func CreateStudyProgram(service service.StudyProgramService) echo.HandlerFunc {
	return func(c echo.Context) error {
		var req dto.CreateStudyProgramReq
		c.Bind(&req)
		studyProgram, err := service.CreateStudyProgram(req)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrRecordNotFound,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    studyProgram,
			Message: "Create study program successfully",
		})

	}
}
