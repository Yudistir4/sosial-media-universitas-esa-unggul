package handler

import (
	"backend/internal/polling/service"
	"backend/pkg/utils/httputils"

	"github.com/labstack/echo/v4"
)

func (h *pollingHandler) GetFacultysFilter(service service.PollingService) echo.HandlerFunc {
	return func(c echo.Context) error {

		users, err := service.GetFacultysFilter()
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    users,
			Message: "Get facultys filter successfully",
		})

	}
}
