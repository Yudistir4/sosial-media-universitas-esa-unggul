package handler

import (
	"backend/internal/studyprogram/service"
	"backend/pkg/dto"
	"backend/pkg/utils/httputils"
	"backend/pkg/utils/tokenutils"

	customerrors "backend/pkg/errors"

	"github.com/labstack/echo/v4"
)

func (h *studyProgramHandler) DeleteStudyProgram(service service.StudyProgramService) echo.HandlerFunc {
	return func(c echo.Context) error {
		loggedInUser, ok := c.Get("user").(tokenutils.Payload)
		if !ok || loggedInUser.UserType != "university" {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrUnauthorizedRole,
			})
		}
		var req dto.DeleteStudyProgramReq
		c.Bind(&req)
		err := service.DeleteStudyProgram(req.ID)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    nil,
			Message: "Delete study program successfully",
		})

	}
}
