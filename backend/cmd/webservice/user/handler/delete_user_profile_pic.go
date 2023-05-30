package handler

import (
	"backend/internal/user/service"
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"
	"backend/pkg/utils/tokenutils"

	"github.com/labstack/echo/v4"
)

func (h *userHandler) DeleteUserProfilePic(service service.UserService) echo.HandlerFunc {
	return func(c echo.Context) error {
		var req dto.IDParamReq
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

		loggedInUser, ok := c.Get("user").(tokenutils.Payload)
		if !ok || loggedInUser.UserID != req.ID {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrUnauthorizedRole,
			})
		}

		err = service.DeleteUserProfilePic(req.ID)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Message: "Delete profile picture successfully",
		})

	}
}
