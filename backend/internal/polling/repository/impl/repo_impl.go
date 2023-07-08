package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type pollingRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type PollingRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewPollingRepository(params *PollingRepositoryParams) *pollingRepository {
	return &pollingRepository{
		db:  params.DB,
		log: params.Log,
	}
}
