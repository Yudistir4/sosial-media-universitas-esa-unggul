package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *saveRepository) CheckIsSaved(PostID uuid.UUID, UserID uuid.UUID) (bool, error) {

	var save dto.Save
	result := r.db.Where("post_id = ? AND user_id = ?", PostID, UserID).First(&save)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return false, nil
		}
		return false, result.Error
	}
	return true, nil
}
