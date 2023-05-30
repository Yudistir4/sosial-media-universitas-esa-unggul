package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type likeRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type LikeRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewLikeRepository(params *LikeRepositoryParams) *likeRepository {
	return &likeRepository{
		db:  params.DB,
		log: params.Log,
	}
}
