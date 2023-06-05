package handler

import (
	"backend/internal/notification/service"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"
	"backend/pkg/utils/tokenutils"

	"github.com/labstack/echo/v4"
)

func (h *notificationHandler) MarkNotificationsAsRead(service service.NotificationService) echo.HandlerFunc {
	return func(c echo.Context) error {

		// Get Logged In User From Token
		loggedInUser, ok := c.Get("user").(tokenutils.Payload)
		if !ok {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrInternalServer,
			})
		}

		err := service.MarkNotificationsAsRead(loggedInUser.UserID)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Message: "Mark notifications as read successfully",
		})

	}
}
