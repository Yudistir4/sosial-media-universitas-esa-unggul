package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type studentRepository struct {
	db  *gorm.DB
	tx  *gorm.DB
	log *logrus.Entry
}

type StudentRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewStudentRepository(params *StudentRepositoryParams) *studentRepository {
	return &studentRepository{
		db:  params.DB,
		log: params.Log,
	}
}
