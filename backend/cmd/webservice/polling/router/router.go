package router

import (
	"backend/cmd/webservice/apiversioning"
	"backend/cmd/webservice/polling/handler"
	"backend/internal/polling/service"
	customemiddleware "backend/pkg/middleware/service"
	"backend/pkg/utils/validatorutils"

	"github.com/labstack/echo/v4"
	"github.com/sirupsen/logrus"
)

type RouterParams struct {
	E          *echo.Echo
	Service    service.PollingService
	Log        *logrus.Entry
	Validator  *validatorutils.Validator
	Middleware customemiddleware.Middleware
}

func InitPollingRouter(params RouterParams) {
	pollingHandler := handler.NewPollingHandler(&handler.PollingHandlerParams{
		Service:   params.Service,
		Log:       params.Log,
		Validator: params.Validator,
	})

	pollingV1Group := params.E.Group(apiversioning.APIVersion1 + "/pollings")
	pollingV1Group.POST("", pollingHandler.CreatePolling(params.Service), params.Middleware.UserMustAuthorized())
	pollingV1Group.PATCH("/:polling-id/options/:option-id", pollingHandler.Vote(params.Service), params.Middleware.UserMustAuthorized())
	pollingV1Group.GET("/:id", pollingHandler.GetPollingByID(params.Service), params.Middleware.UserMustAuthorized())
	pollingV1Group.GET("", pollingHandler.GetPollings(params.Service), params.Middleware.UserMustAuthorized())
	pollingV1Group.GET("/faculty-filter", pollingHandler.GetFacultysFilter(params.Service), params.Middleware.UserMustAuthorized())
	pollingV1Group.GET("/study-program-filter", pollingHandler.GetStudyProgramsFilter(params.Service), params.Middleware.UserMustAuthorized())
	pollingV1Group.GET("/batches-filter", pollingHandler.GetBatchesFilter(params.Service), params.Middleware.UserMustAuthorized())
	pollingV1Group.DELETE("/:id", pollingHandler.DeletePolling(params.Service), params.Middleware.UserMustAuthorized())
}
