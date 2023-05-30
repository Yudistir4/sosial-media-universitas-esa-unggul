package service

import "github.com/labstack/echo/v4"

type Middleware interface {
	UserMustAuthorized() echo.MiddlewareFunc
	 
}
