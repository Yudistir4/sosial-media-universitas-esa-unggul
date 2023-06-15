package handler

import (
	"backend/internal/studyprogram/service"
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"
	"backend/pkg/utils/tokenutils"
	"fmt"

	"github.com/labstack/echo/v4"
)

func (h *studyProgramHandler) UpdateStudyProgramName(service service.StudyProgramService) echo.HandlerFunc {
	return func(c echo.Context) error {
		loggedInUser, ok := c.Get("user").(tokenutils.Payload)
		fmt.Println(loggedInUser.UserType)
		if !ok || loggedInUser.UserType != "university" {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrUnauthorizedRole,
			})
		}
		var req dto.UpdateStudyProgramNameReq
		c.Bind(&req)
		studyProgram, err := service.UpdateStudyProgramName(req)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    studyProgram,
			Message: "Update study program successfully",
		})

	}
}
