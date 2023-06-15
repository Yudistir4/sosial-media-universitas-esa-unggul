package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *likeRepository) GetTotalLikes(PostID uuid.UUID) (int64, error) {

	var likeCount int64
	result := r.db.Model(&dto.Like{}).Where("post_id = ?", PostID).Count(&likeCount)
	if result.Error != nil {
		return 0, result.Error
	}
	return likeCount, nil
}
