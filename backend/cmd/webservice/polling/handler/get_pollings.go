package handler

import (
	"backend/internal/polling/service"
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"
	"backend/pkg/utils/tokenutils"

	"github.com/labstack/echo/v4"
)

func (h *pollingHandler) GetPollings(service service.PollingService) echo.HandlerFunc {
	return func(c echo.Context) error {

		// Get Logged In User From Token
		loggedInUser, ok := c.Get("user").(tokenutils.Payload)
		if !ok {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrInternalServer,
			})
		}

		// Binding data and assign userID
		var req dto.GetPollingsReq
		err := c.Bind(&req)
		req.LoggedInUserID = loggedInUser.UserID
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
		if req.Page == 0 {
			req.Page = 1
		}
		if req.Limit == 0 {
			req.Limit = 20
		}

		pollings, err := service.GetPollings(req)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    pollings,
			Message: "Get pollings successfully",
		})

	}
}
