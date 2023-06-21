package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *notificationRepository) GetTotalUnreadNotifications(UserID uuid.UUID) (int64, error) {

	var notifCount int64
	result := r.db.Model(&dto.Notification{}).Where("to_user_id = ? AND is_read = false", UserID).Count(&notifCount)
	if result.Error != nil {
		return 0, result.Error
	}
	return notifCount, nil
}
