package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *commentRepository) DeleteCommentByID(CommentID uuid.UUID) error {
	result := r.db.Delete(&dto.Comment{}, CommentID)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
