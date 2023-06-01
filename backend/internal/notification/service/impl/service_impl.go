package impl

import (
	"backend/config"
	"backend/internal/notification/repository"

	"github.com/sirupsen/logrus"
)

type notificationService struct {
	repo   repository.NotificationRepository
	log    *logrus.Entry
	config *config.Config
}
type NotificationServiceParams struct {
	Repo   repository.NotificationRepository
	Log    *logrus.Entry
	Config *config.Config
}

func NewNotificationService(params *NotificationServiceParams) *notificationService {
	return &notificationService{
		repo:   params.Repo,
		log:    params.Log,
		config: params.Config,
	}
}
