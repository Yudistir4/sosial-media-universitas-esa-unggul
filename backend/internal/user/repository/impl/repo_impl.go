package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type userRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type UserRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewUserRepository(params *UserRepositoryParams) *userRepository {
	return &userRepository{
		db:  params.DB,
		log: params.Log,
	}
}
