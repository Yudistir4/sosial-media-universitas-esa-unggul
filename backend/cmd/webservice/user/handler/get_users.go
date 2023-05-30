package handler

import (
	"backend/internal/user/service"
	"backend/pkg/dto"
	"backend/pkg/utils/httputils"

	customerrors "backend/pkg/errors"

	"github.com/labstack/echo/v4"
)

func (h *userHandler) GetUsers(service service.UserService) echo.HandlerFunc {
	return func(c echo.Context) error {

		var req dto.GetUsersReq
		err := c.Bind(&req)

		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrBadRequest,
			})
		}
		users, err := service.GetUsers(req)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrRecordNotFound,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    users,
			Message: "Get users successfully",
		})

	}
}
