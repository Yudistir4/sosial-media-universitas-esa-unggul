package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *commentRepository) CreateComment(req dto.CreateCommentReq, tx *gorm.DB) (dto.Comment, error) {
	if tx == nil {
		return dto.Comment{}, errors.New("transaction not started")
	}
	comment := dto.Comment{
		ID:      uuid.New(),
		PostID:  req.PostID,
		UserID:  req.UserID,
		Comment: req.Comment,
	}

	if err := tx.Create(&comment).Error; err != nil {
		return dto.Comment{}, err
	}

	return comment, nil
}
