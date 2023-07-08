package handler

import (
	"backend/internal/polling/service"
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"
	"backend/pkg/utils/tokenutils"
	"fmt"
	"os"

	"github.com/labstack/echo/v4"
)

func (h *pollingHandler) CreatePolling(service service.PollingService) echo.HandlerFunc {
	return func(c echo.Context) error {

		// Get Logged In User From Token
		loggedInUser, ok := c.Get("user").(tokenutils.Payload)
		if !ok {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrInternalServer,
			})
		}

		// Binding data and assign userID
		// var req dto.
		req := new(dto.CreatePollingReq)
		err := c.Bind(req)
		req.LoggedInUserID = loggedInUser.UserID
		if err != nil {
			fmt.Println(err)
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: customerrors.ErrBadRequest,
			})
		}

		fmt.Println(req.Voters)

		for i := 0; i < req.TotalOptions; i++ {
			//  target:= fmt.Sprintf("options[%d].text", i)
			var option dto.CreateOptionReq
			option.Text = c.FormValue(fmt.Sprintf("options[%d].text", i))
			if req.UseImage {
				option.Image, err = c.FormFile(fmt.Sprintf("options[%d].image", i))
				if err != nil {
					return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
						Err: customerrors.ErrInternalServer,
					})
				}

				if option.Image != nil {
					ok := httputils.CheckImageFileType(option.Image)
					if !ok {
						return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
							Err: customerrors.ErrBadRequestFileType,
						})

					}

					var err error
					option.ImageSrc, err = httputils.HandleFileForm(option.Image)
					if err != nil {
						return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
							Err: customerrors.ErrBadRequest,
						})
					}
					defer os.Remove(option.ImageSrc)
				}
			}
			req.Options = append(req.Options, option)
		}

		// Validasi struct
		err = h.validator.StructCtx(c.Request().Context(), req)
		if err != nil {
			errStr := h.validator.TranslateValidatorError(err)
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err:    customerrors.ErrBadRequest,
				Detail: errStr,
			})
		}

		polling, err := service.CreatePolling(*req)
		if err != nil {
			return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
				Err: err,
			})
		}
		return httputils.SuccessResponse(c, httputils.SuccessResponseParams{
			Data:    polling,
			Message: "Create polling successfully",
		})

	}
}
