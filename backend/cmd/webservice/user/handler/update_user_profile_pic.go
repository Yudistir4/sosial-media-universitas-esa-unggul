package handler

import (
	"backend/internal/user/service"
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"
	"backend/pkg/utils/tokenutils"
	"os"

	"github.com/labstack/echo/v4"
)

func (h *userHandler) UpdateUserProfilePic(service service.UserService) echo.HandlerFunc {
	return func(c echo.Context) error {
		var req dto.UpdateProfilePicReq
		err := c.Bind(&req)
		req.ProfilePic, err = c.FormFile("profile_pic")
		ok := httputils.CheckProfilePicFileType(req.ProfilePic)
		if !ok {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrBadRequestFileType,
			})

		}
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrBadRequest,
			})
		}

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

		req.ProfilePicSrc, err = httputils.HandleFileForm(req.ProfilePic)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrBadRequest,
			})
		}
		defer os.Remove(req.ProfilePicSrc)

		user, err := service.UpdateUserProfilePic(req)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    user,
			Message: "Update profile picture successfully",
		})

	}
}
