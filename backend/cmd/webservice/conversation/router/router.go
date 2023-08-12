package router

import (
	"backend/cmd/webservice/apiversioning"
	"backend/cmd/webservice/conversation/handler"
	"backend/internal/conversation/service"
	customemiddleware "backend/pkg/middleware/service"
	"backend/pkg/utils/validatorutils"

	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
)

type RouterParams struct {
	E          *echo.Echo
	Service    service.ConversationService
	Log        *logrus.Entry
	Validator  *validatorutils.Validator
	Middleware customemiddleware.Middleware
}

func InitConversationRouter(params RouterParams) {
	conversationHandler := handler.NewConversationHandler(&handler.ConversationHandlerParams{
		Service:   params.Service,
		Log:       params.Log,
		Validator: params.Validator,
	})

	conversationV1Group := params.E.Group(apiversioning.APIVersion1 + "/conversations")
	conversationV1Group.POST("", conversationHandler.CreateConversation(params.Service), params.Middleware.UserMustAuthorized())
	conversationV1Group.POST("/:conversation_id/messages", conversationHandler.CreateMessage(params.Service), params.Middleware.UserMustAuthorized())
	conversationV1Group.GET("/:conversation_id/messages", conversationHandler.GetMessages(params.Service), params.Middleware.UserMustAuthorized())
	conversationV1Group.PUT("/:conversation_id/messages", conversationHandler.MarkMessagesAsRead(params.Service), params.Middleware.UserMustAuthorized())
	conversationV1Group.GET("", conversationHandler.GetConversations(params.Service), params.Middleware.UserMustAuthorized())
}
