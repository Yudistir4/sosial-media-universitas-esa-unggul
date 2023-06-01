package impl

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type notificationRepository struct {
	db  *gorm.DB
	log *logrus.Entry
}

type NotificationRepositoryParams struct {
	DB  *gorm.DB
	Log *logrus.Entry
}

func NewNotificationRepository(params *NotificationRepositoryParams) *notificationRepository {
	return &notificationRepository{
		db:  params.DB,
		log: params.Log,
	}
}
