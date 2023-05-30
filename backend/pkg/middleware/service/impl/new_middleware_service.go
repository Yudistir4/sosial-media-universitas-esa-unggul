package impl

import (
	"backend/config"

	"github.com/go-redis/redis/v8"
	"github.com/sirupsen/logrus"
)

type middleware struct {
	config *config.Config
	redis  *redis.Client
	log    *logrus.Entry
}

type MiddlewareParams struct {
	Config *config.Config
	Redis  *redis.Client
	Log    *logrus.Entry
}

func NewServiceMiddleware(params *MiddlewareParams) *middleware {
	return &middleware{
		config: params.Config,
		redis:  params.Redis,
		log:    params.Log,
	}
}
