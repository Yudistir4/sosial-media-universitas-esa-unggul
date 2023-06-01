package impl

import (
	"backend/pkg/dto"
)

func (r *notificationRepository) GetNotifications(req dto.GetNotificationsReq) ([]dto.Notification, error) {
	var notifications []dto.Notification

	offset := (req.Page - 1) * req.Limit
	if err := r.db.Preload("FromUser").Preload("Post").Preload("Comment").
		Where("to_user_id = ?", req.UserID).Offset(offset).Limit(req.Limit).Order("created_at desc").Find(&notifications).Error; err != nil {
		r.log.Errorln("[ERROR] Create notification Error:", err)
		return []dto.Notification{}, err
	}
	return notifications, nil
}
