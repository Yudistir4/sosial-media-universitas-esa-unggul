package service

import "backend/pkg/dto"

type NotificationService interface {
	GetNotifications(req dto.GetNotificationsReq) ([]dto.NotificationResponse, error)
}
