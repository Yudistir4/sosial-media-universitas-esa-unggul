package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type saveRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type SaveRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewSaveRepository(params *SaveRepositoryParams) *saveRepository {
	return &saveRepository{
		db:  params.DB,
		log: params.Log,
	}
}
