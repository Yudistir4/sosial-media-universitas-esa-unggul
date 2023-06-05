package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *likeRepository) GetLike(PostID uuid.UUID, UserID uuid.UUID) (dto.Like, error) {

	var like dto.Like
	result := r.db.Where("post_id = ? AND user_id = ?", PostID, UserID).First(&like)
	if result.Error != nil {
		return dto.Like{}, result.Error
	}
	return like, nil
}
