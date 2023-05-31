package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *commentRepository) CreateComment(req dto.CreateCommentReq) (dto.Comment, error) {
	
	comment := dto.Comment{
		ID:      uuid.New(),
		PostID:  req.PostID,
		UserID:  req.UserID,
		Comment: req.Comment,
	}

	if err := r.db.Create(&comment).Error; err != nil {
		return dto.Comment{}, err
	}

	return comment, nil
}
