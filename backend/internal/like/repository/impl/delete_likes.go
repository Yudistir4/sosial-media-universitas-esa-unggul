package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *likeRepository) DeleteLikes(PostID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	result := tx.Where("post_id = ?", PostID).Delete(&dto.Like{})
	r.log.Infoln("Affected: ", result.RowsAffected)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete Likes Error:", result.Error)
		return result.Error
	}
	return nil
}
