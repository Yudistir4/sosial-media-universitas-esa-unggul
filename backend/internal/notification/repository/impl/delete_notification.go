package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *notificationRepository) DeleteNotification(req dto.DeleteNotificationReq, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}
	
	var query *gorm.DB
	if req.CommentID != uuid.Nil {
		query = tx.Where("comment_id = ?", req.CommentID)
	} else if req.LikeID != uuid.Nil {
		query = tx.Where("like_id = ?", req.LikeID)
	}

	if err := query.Delete(&dto.Notification{}).Error; err != nil {
		r.log.Errorln("[ERROR] Delete notification Error:", err)
		return err
	}
	return nil
}
