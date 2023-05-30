package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *likeRepository) CreateLike(PostID uuid.UUID, UserID uuid.UUID) error {

	like := dto.Like{
		ID:     uuid.New(),
		PostID: PostID,
		UserID: UserID,
	}

	result := r.db.Create(&like)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
