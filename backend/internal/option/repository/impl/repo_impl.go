package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type optionRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type OptionRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewOptionRepository(params *OptionRepositoryParams) *optionRepository {
	return &optionRepository{
		db:  params.DB,
		log: params.Log,
	}
}
