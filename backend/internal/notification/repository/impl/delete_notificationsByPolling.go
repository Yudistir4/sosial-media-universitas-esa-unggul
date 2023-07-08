package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *notificationRepository) DeleteNotificationsByPolling(PollingID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	if err := tx.Where("polling_id = ?", PollingID).Delete(&dto.Notification{}).Error; err != nil {
		r.log.Errorln("[ERROR] Delete notifications Error:", err)
		return err
	}
	return nil
}
