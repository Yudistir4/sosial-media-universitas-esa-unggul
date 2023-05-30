package handler

import (
	"backend/internal/studyprogram/service"
	"backend/pkg/dto"
	"backend/pkg/utils/httputils"

	customerrors "backend/pkg/errors"

	"github.com/labstack/echo/v4"
)

func DeleteStudyProgram(service service.StudyProgramService) echo.HandlerFunc {
	return func(c echo.Context) error {
		var req dto.DeleteStudyProgramReq
		c.Bind(&req)
		err := service.DeleteStudyProgram(req.ID)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrRecordNotFound,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    nil,
			Message: "Delete study program successfully",
		})

	}
}
