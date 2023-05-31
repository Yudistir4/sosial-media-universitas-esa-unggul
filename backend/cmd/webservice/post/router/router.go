package router

import (
	"backend/cmd/webservice/apiversioning"
	"backend/cmd/webservice/post/handler"
	"backend/internal/post/service"
	customemiddleware "backend/pkg/middleware/service"
	"backend/pkg/utils/validatorutils"

	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
)

type RouterParams struct {
	E          *echo.Echo
	Service    service.PostService
	Log        *logrus.Entry
	Validator  *validatorutils.Validator
	Middleware customemiddleware.Middleware
}

func InitPostRouter(params RouterParams) {
	postHandler := handler.NewPostHandler(&handler.PostHandlerParams{
		Service:   params.Service,
		Log:       params.Log,
		Validator: params.Validator,
	})

	postV1Group := params.E.Group(apiversioning.APIVersion1 + "/posts")
	postV1Group.POST("", postHandler.CreatePost(params.Service), params.Middleware.UserMustAuthorized())
	postV1Group.GET("/:id", postHandler.GetPostByID(params.Service), params.Middleware.UserMustAuthorized())
	postV1Group.GET("", postHandler.GetPosts(params.Service), params.Middleware.UserMustAuthorized())
	postV1Group.PUT("/:id", postHandler.UpdatePost(params.Service), params.Middleware.UserMustAuthorized())
	postV1Group.POST("/:id/like", postHandler.LikePost(params.Service), params.Middleware.UserMustAuthorized())
	postV1Group.DELETE("/:id/like", postHandler.UnlikePost(params.Service), params.Middleware.UserMustAuthorized())
	postV1Group.POST("/:id/save", postHandler.SavePost(params.Service), params.Middleware.UserMustAuthorized())
	postV1Group.DELETE("/:id/save", postHandler.UnsavePost(params.Service), params.Middleware.UserMustAuthorized())
}
