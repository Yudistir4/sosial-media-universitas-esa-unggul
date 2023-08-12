package impl

import (
	"backend/config"

	"backend/internal/conversation/repository"
	repoMessage "backend/internal/message/repository"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type conversationService struct {
	repo             repository.ConversationRepository
	 repoMessage 	repoMessage.MessageRepository
	log              *logrus.Entry
	config           *config.Config
	claudinary       *cloudinary.Cloudinary
	db               *gorm.DB
}
type ConversationServiceParams struct {
	Repo             repository.ConversationRepository
 RepoMessage repoMessage.MessageRepository
	Log              *logrus.Entry
	Config           *config.Config
	Claudinary       *cloudinary.Cloudinary
	DB               *gorm.DB
}

func NewConversationService(params *ConversationServiceParams) *conversationService {
	return &conversationService{
		repo:             params.Repo,
		repoMessage: params.RepoMessage,
		log:              params.Log,
		config:           params.Config,
		claudinary:       params.Claudinary,
		db:               params.DB,
		 
	}
}
