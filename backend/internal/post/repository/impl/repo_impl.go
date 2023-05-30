package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type postRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type PostRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewPostRepository(params *PostRepositoryParams) *postRepository {
	return &postRepository{
		db:  params.DB,
		log: params.Log,
	}
}
