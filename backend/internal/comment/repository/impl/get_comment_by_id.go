package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *commentRepository) GetCommentByID(CommentID uuid.UUID) (dto.Comment, error) {

	var comment dto.Comment
	if err := r.db.Preload("User").First(&comment, CommentID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return dto.Comment{}, customerrors.ErrCommentNotFound
		}
		return dto.Comment{}, err
	}

	return comment, nil
}
