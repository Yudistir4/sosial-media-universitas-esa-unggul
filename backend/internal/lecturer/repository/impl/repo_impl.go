package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type lecturerRepository struct {
	db *gorm.DB

	log *logrus.Entry
}

type LecturerRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewLecturerRepository(params *LecturerRepositoryParams) *lecturerRepository {
	return &lecturerRepository{
		db:  params.DB,
		log: params.Log,
	}
}
