package impl

import (
	"gorm.io/gorm"

	"github.com/sirupsen/logrus"
)

type authRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type AuthRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewAuthRepository(params *AuthRepositoryParams) *authRepository {
	return &authRepository{
		db:  params.DB,
		log: params.Log,
	}
}
