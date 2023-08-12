package handler

import (
	"backend/internal/conversation/service"
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"

	"github.com/labstack/echo/v4"
)

func (h *conversationHandler) MarkMessagesAsRead(service service.ConversationService) echo.HandlerFunc {
	return func(c echo.Context) error {

		// Get Logged In User From Token
		// loggedInUser, ok := c.Get("user").(tokenutils.Payload)
		// if !ok {
		// 	return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
		// 		Err: customerrors.ErrInternalServer,
		// 	})
		// }

		// Binding data and assign userID
		// var req dto.
		var req dto.MarkMessagesAsReadReq
		h.log.Infoln("hi1")
		err := c.Bind(&req)
		if err != nil {

			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrBadRequest,
			})
		}

		h.log.Infoln("hi2")
		// Validasi struct
		err = h.validator.StructCtx(c.Request().Context(), req)
		if err != nil {
			errStr := h.validator.TranslateValidatorError(err)
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err:    customerrors.ErrBadRequest,
				Detail: errStr,
			})
		}
		h.log.Infoln("hi3")

		err = service.MarkMessagesAsRead(req)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{

			Message: "Mark messages as read successfully",
		})

	}
}
