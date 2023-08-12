package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type messageRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type MessageRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewMessageRepository(params *MessageRepositoryParams) *messageRepository {
	return &messageRepository{
		db:  params.DB,
		log: params.Log,
	}
}
