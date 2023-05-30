package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *saveRepository) DeleteSave(PostID uuid.UUID, UserID uuid.UUID) error {
	result := r.db.Where("post_id = ? AND user_id = ?", PostID, UserID).Delete(&dto.Save{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}
