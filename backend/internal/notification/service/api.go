package service

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

type NotificationService interface {
	GetTotalUnreadNotifications(UserID uuid.UUID) (int64, error)
	GetNotifications(req dto.GetNotificationsReq) ([]dto.NotificationResponse, error)
	MarkNotificationsAsRead(UserID uuid.UUID) error
}
