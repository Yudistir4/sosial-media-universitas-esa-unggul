package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *notificationRepository) DeleteNotificationsRelatedToUser(UserID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	if err := tx.Where("from_user_id = ? OR to_user_id = ?", UserID,UserID).Delete(&dto.Notification{}).Error; err != nil {
		r.log.Errorln("[ERROR] Delete notifications Error:", err)
		return err
	}
	return nil
}
