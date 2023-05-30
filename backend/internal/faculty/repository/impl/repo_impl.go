package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type facultyRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type FacultyRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewFacultyRepository(params *FacultyRepositoryParams) *facultyRepository {
	return &facultyRepository{
		db:  params.DB,
		log: params.Log,
	}
}
