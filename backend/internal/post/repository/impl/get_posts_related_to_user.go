package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *postRepository) GetPostsRelatedToUser(UserID uuid.UUID) ([]dto.Post, error) {

	var posts []dto.Post

	err := r.db.Where("user_id = ?", UserID).Find(&posts).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, customerrors.ErrPostNotFound
		}
		return nil, err
	}

	return posts, nil
}
