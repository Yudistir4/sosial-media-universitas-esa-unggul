package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type studyProgramRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type StudyProgramRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewStudyProgramRepository(params *StudyProgramRepositoryParams) *studyProgramRepository {
	return &studyProgramRepository{
		db:  params.DB,
		log: params.Log,
	}
}
