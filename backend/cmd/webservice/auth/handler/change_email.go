package handler

import (
	"backend/internal/auth/service"
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"
	"backend/pkg/utils/tokenutils"

	"github.com/labstack/echo/v4"
)

func (h *authHandler) ChangeEmail(service service.AuthService) echo.HandlerFunc {
	return func(c echo.Context) error {
		var req dto.ChangeEmailReq
		err := c.Bind(&req)

		loggedInUser := c.Get("user").(tokenutils.Payload)
		req.ID = loggedInUser.UserID

		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrBadRequest,
			})
		}
		err = h.validator.StructCtx(c.Request().Context(), req)
		if err != nil {
			errStr := h.validator.TranslateValidatorError(err)
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err:    customerrors.ErrBadRequest,
				Detail: errStr,
			})
		}

		err = service.ChangeEmail(req)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Message: "Email verification code sent successfully. Please check your email.",
		})

	}
}
