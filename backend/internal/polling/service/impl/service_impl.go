package impl

import (
	"backend/config"
	repoOption "backend/internal/option/repository"
	repoNotification "backend/internal/notification/repository"
	"backend/internal/polling/repository"
	repoVoter "backend/internal/voter/repository"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type pollingService struct {
	repo             repository.PollingRepository
	repoVoter         repoVoter.VoterRepository
	repoOption      repoOption.OptionRepository
	repoNotification repoNotification.NotificationRepository
	log              *logrus.Entry
	config           *config.Config
	claudinary       *cloudinary.Cloudinary
	db               *gorm.DB
}
type PollingServiceParams struct {
	Repo             repository.PollingRepository
	RepoVoter         repoVoter.VoterRepository
	RepoOption      repoOption.OptionRepository
	RepoNotification repoNotification.NotificationRepository
	Log              *logrus.Entry
	Config           *config.Config
	Claudinary       *cloudinary.Cloudinary
	DB               *gorm.DB
}

func NewPollingService(params *PollingServiceParams) *pollingService {
	return &pollingService{
		repo:             params.Repo,
		log:              params.Log,
		config:           params.Config,
		claudinary:       params.Claudinary,
		db:               params.DB,
		repoVoter:         params.RepoVoter,
		repoOption:      params.RepoOption,
		repoNotification: params.RepoNotification,
	}
}
