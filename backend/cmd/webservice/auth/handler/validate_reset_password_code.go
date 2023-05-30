package handler

import (
	"backend/internal/auth/service"
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"

	"github.com/labstack/echo/v4"
)

func (h *authHandler) ValidateResetPasswordCode(service service.AuthService) echo.HandlerFunc {
	return func(c echo.Context) error {
		var req dto.ValidateResetPasswordCodeReq
		err := c.Bind(&req)

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

		err = service.ValidateResetPasswordCode(req)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Message: "Reset password link is valid. Proceed with resetting the password.",
		})

	}
}
