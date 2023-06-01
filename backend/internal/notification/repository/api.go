package repository

import (
	"backend/pkg/dto"

	"gorm.io/gorm"
)

type NotificationRepository interface {
	CreateNotification(req dto.CreateNotificationReq, tx *gorm.DB) error
	DeleteNotification(req dto.DeleteNotificationReq, tx *gorm.DB) error
	GetNotifications(req dto.GetNotificationsReq) ([]dto.Notification, error)
}
