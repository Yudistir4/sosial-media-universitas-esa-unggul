package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *commentRepository) GetTotalComments(PostID uuid.UUID) (int64, error) {

	var commentCount int64
	result := r.db.Model(&dto.Comment{}).Where("post_id = ?", PostID).Count(&commentCount)
	if result.Error != nil {
		return 0, result.Error
	}
	return commentCount, nil
}
