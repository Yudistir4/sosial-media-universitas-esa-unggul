package handler

import (
	"backend/internal/user/service"
	"backend/pkg/dto"
	"backend/pkg/utils/httputils"

	customerrors "backend/pkg/errors"

	"github.com/labstack/echo/v4"
)

func CreateUser(service service.UserService) echo.HandlerFunc {
	return func(c echo.Context) error {
		var req dto.CreateUserReq
		c.Bind(&req)
		user, err := service.CreateUser(req)
		if err != nil {
			return httputils.WriteErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrRecordNotFound,
			})
		}
		return httputils.WriteResponse(c, httputils.SuccessResponseParams{
			Data: user,
		})

	}
}
