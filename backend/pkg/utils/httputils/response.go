package httputils

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/labstack/echo/v4"
)

type SuccessResponseParams struct {
	Code    int
	Message string
	Data    interface{}
}

type ErrorResponseParams struct {
	Err    error
	Detail interface{}
}

func SuccessResponse(c echo.Context, data SuccessResponseParams) error {
	if data.Code == 0 {
		data.Code = 200
	}
	return c.JSON(data.Code, dto.BaseResponse{
		Error:   nil,
		Message: data.Message,
		Data:    data.Data,
	})
}

func ErrorResponse(c echo.Context, params ErrorResponseParams) error {
	e := customerrors.GetErr(params.Err)
	return c.JSON(e.HTTPErrorCode, dto.BaseResponse{
		Error: &dto.ErrorBaseResponse{
			Message: e.Message,
			Detail:  params.Detail,
		},
	})
}
