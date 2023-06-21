package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type NotificationRepository interface {
	CreateNotification(req dto.CreateNotificationReq, tx *gorm.DB) error
	DeleteNotification(req dto.DeleteNotificationReq, tx *gorm.DB) error
	DeleteNotifications(PostID uuid.UUID, tx *gorm.DB) error
	GetTotalUnreadNotifications(UserID uuid.UUID) (int64, error)
	GetNotifications(req dto.GetNotificationsReq) ([]dto.Notification, error)
	MarkNotificationsAsRead(UserID uuid.UUID) error
}
