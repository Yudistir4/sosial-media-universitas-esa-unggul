package handler

import (
	"backend/internal/auth/service"
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"

	"github.com/labstack/echo/v4"
)

func (h *authHandler) ResetPasswordAfterForgot(service service.AuthService) echo.HandlerFunc {
	return func(c echo.Context) error {
		var req dto.ResetPasswordAfterForgotReq
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

		err = service.ResetPasswordAfterForgot(req)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Message: "Reset password successfully",
		})

	}
}
