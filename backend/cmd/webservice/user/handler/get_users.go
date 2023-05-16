package handler

import (
	"backend/internal/user/service"
	"backend/pkg/utils/httputils"

	customerrors "backend/pkg/errors"

	"github.com/labstack/echo/v4"
)

func GetUsers(service service.UserService) echo.HandlerFunc {
	return func(c echo.Context) error {
		users, err := service.GetUsers()
		if err != nil {
			return httputils.WriteErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrRecordNotFound,
			})
		}
		return httputils.WriteResponse(c, httputils.SuccessResponseParams{
			Data: users,
		})

	}
}
