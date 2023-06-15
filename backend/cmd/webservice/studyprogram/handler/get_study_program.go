package handler

import (
	"backend/internal/studyprogram/service"
	"backend/pkg/dto"
	"backend/pkg/utils/httputils"

	customerrors "backend/pkg/errors"

	"github.com/labstack/echo/v4"
)

func (h *studyProgramHandler) GetStudyPrograms(service service.StudyProgramService) echo.HandlerFunc {
	return func(c echo.Context) error {

		var req dto.GetStudyProgramsReq
		err := c.Bind(&req)

		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrBadRequest,
			})
		}
		studyPrograms, err := service.GetStudyPrograms(req)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrRecordNotFound,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    studyPrograms,
			Message: "Get study programs successfully",
		})

	}
}
