package service

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

type NotificationService interface {
	GetNotifications(req dto.GetNotificationsReq) ([]dto.NotificationResponse, error)
	MarkNotificationsAsRead(UserID uuid.UUID) error
}
