package impl

import (
	"backend/pkg/dto"
	"errors"

	"gorm.io/gorm"
)

func (r *notificationRepository) CreateNotifications(notifications []*dto.Notification, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	result := tx.Create(&notifications)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
