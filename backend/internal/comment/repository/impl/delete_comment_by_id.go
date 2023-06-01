package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *commentRepository) DeleteCommentByID(CommentID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}
	result := tx.Delete(&dto.Comment{}, CommentID)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
