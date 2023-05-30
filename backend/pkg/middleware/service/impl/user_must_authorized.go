package impl

import (
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/httputils"
	"backend/pkg/utils/tokenutils"
	"strings"

	"github.com/labstack/echo/v4"
)

func (m *middleware) UserMustAuthorized() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authorization := c.Request().Header.Get("Authorization")
			if authorization == "" {
				return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
					Err:    customerrors.ErrBadRequest,
					Detail: []string{"Authorization header value couldn't be empty"},
				})
			}

			splitted := strings.SplitAfter(authorization, "Bearer ")
			if len(splitted) != 2 {
				return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
					Err:    customerrors.ErrBadRequest,
					Detail: []string{"Bearer format is not valid"},
				})
			}

			if splitted[1] == "" {
				return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
					Err:    customerrors.ErrBadRequest,
					Detail: []string{"Bearer value is couldn't empty"},
				})
			}

			accessToken := splitted[1]

			user, err := tokenutils.ValidateAccessToken(&m.config.JWTConfig, accessToken)
			if err != nil {
				return httputils.ErrorResponse(c, httputils.ErrorResponseParams{
					Err: err,
				})
			}

			c.Set("user", user)

			return next(c)
		}
	}
}
