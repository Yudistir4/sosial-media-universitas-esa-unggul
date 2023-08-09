package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *likeRepository) DeleteLikesRelatedToUser(UserID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	result := tx.Where("user_id = ?", UserID).Delete(&dto.Like{})
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete Likes Error:", result.Error)
		return result.Error
	}
	return nil
}
