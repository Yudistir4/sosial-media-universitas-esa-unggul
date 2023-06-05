package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *notificationRepository) MarkNotificationsAsRead(UserID uuid.UUID) error {

	if err := r.db.Model(&dto.Notification{}).Where("to_user_id = ?", UserID).Update("IsRead", true).Error; err != nil {
		r.log.Errorln("[ERROR] Mark Notifications As Read Error:", err)
		return err
	}
	return nil
}
