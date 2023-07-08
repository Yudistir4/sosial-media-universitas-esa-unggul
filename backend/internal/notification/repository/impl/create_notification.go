package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *notificationRepository) CreateNotification(req dto.CreateNotificationReq, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	var activity = req.Activity
	if req.CommentID != nil {
		activity = "comment"
	} else if req.LikeID != nil {
		activity = "like"
	}

	notification := dto.Notification{
		ID:         uuid.New(),
		Activity:   activity,
		IsRead:     false,
		FromUserID: req.FromUserID,
		ToUserID:   req.ToUserID,
		PollingID:  req.PollingID,
		PostID:     req.PostID,
		CommentID:  req.CommentID,
		LikeID:     req.LikeID,
		OptionID:   req.OptionID,
	}

	if err := tx.Create(&notification).Error; err != nil {
		r.log.Errorln("[ERROR] Create notification Error:", err)
		return err
	}
	return nil
}
