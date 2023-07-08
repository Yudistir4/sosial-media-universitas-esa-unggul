package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type voterRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type VoterRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewVoterRepository(params *VoterRepositoryParams) *voterRepository {
	return &voterRepository{
		db:  params.DB,
		log: params.Log,
	}
}
