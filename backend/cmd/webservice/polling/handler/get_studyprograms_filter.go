package handler

import (
	"backend/internal/polling/service"
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"

	"github.com/labstack/echo/v4"
)

func (h *pollingHandler) GetStudyProgramsFilter(service service.PollingService) echo.HandlerFunc {
	return func(c echo.Context) error {

		// Binding data and assign userID
		var req dto.GetStudyProgramsFilterReq
		err := c.Bind(&req)
		// req.LoggedInUserID = loggedInUser.UserID
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrBadRequest,
			})
		}

		// Validasi struct
		err = h.validator.StructCtx(c.Request().Context(), req)
		if err != nil {
			errStr := h.validator.TranslateValidatorError(err)
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err:    customerrors.ErrBadRequest,
				Detail: errStr,
			})
		}

		users, err := service.GetStudyProgramsFilter(req.FacultyID)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    users,
			Message: "Get studyprograms filter successfully",
		})

	}
}
