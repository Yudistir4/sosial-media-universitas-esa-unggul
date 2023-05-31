package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *commentRepository) DeleteComments(PostID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	result := tx.Where("post_id = ?", PostID).Delete(&dto.Comment{})
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete Comments Error:", result.Error)
		return result.Error
	}
	return nil
}
