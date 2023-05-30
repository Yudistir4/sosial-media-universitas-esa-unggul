package handler

import (
	"backend/internal/user/service"
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"
	"backend/pkg/utils/tokenutils"

	"github.com/labstack/echo/v4"
)

func (h *userHandler) DeleteUser(service service.UserService) echo.HandlerFunc {
	return func(c echo.Context) error {
		loggedInUser, ok := c.Get("user").(tokenutils.Payload)
		if !ok || loggedInUser.UserType != "university" {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrUnauthorizedRole,
			})
		}

		var req dto.DeleteUserByIDReq
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

		err = service.DeleteUser(req.ID)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    nil,
			Message: "Delete user successfully",
		})

	}
}
