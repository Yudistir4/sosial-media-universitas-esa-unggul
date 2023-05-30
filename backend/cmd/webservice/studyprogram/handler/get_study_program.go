package handler

import (
	"backend/internal/studyprogram/service"
	"backend/pkg/utils/httputils"

	customerrors "backend/pkg/errors"

	"github.com/labstack/echo/v4"
)

func GetStudyPrograms(service service.StudyProgramService) echo.HandlerFunc {
	return func(c echo.Context) error {
		studyPrograms, err := service.GetStudyPrograms()
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrRecordNotFound,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data: studyPrograms,
		})

	}
}
