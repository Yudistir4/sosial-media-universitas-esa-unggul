package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *saveRepository) DeleteSaves(PostID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	result := tx.Where("post_id = ?", PostID).Delete(&dto.Save{})
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete Saves Error:", result.Error)
		return result.Error
	}
	return nil
}
