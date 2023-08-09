package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *notificationRepository) DeleteNotifications(PostID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	if err := tx.Where("post_id = ?", PostID).Delete(&dto.Notification{}).Error; err != nil {
		r.log.Errorln("[ERROR] Delete notifications Error:", err)
		return err
	}
	return nil
}
