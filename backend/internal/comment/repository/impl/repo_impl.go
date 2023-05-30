package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type commentRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type CommentRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewCommentRepository(params *CommentRepositoryParams) *commentRepository {
	return &commentRepository{
		db:  params.DB,
		log: params.Log,
	}
}
