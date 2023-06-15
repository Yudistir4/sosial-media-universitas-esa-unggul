package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *saveRepository) GetTotalSaves(PostID uuid.UUID) (int64, error) {

	var saveCount int64
	result := r.db.Model(&dto.Save{}).Where("post_id = ?", PostID).Count(&saveCount)
	if result.Error != nil {
		return 0, result.Error
	}
	return saveCount, nil
}
