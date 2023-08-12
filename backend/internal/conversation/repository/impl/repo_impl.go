package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type conversationRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type ConversationRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewConversationRepository(params *ConversationRepositoryParams) *conversationRepository {
	return &conversationRepository{
		db:  params.DB,
		log: params.Log,
	}
}
