package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *saveRepository) CreateSave(PostID uuid.UUID, UserID uuid.UUID) error {

	save := dto.Save{
		ID:     uuid.New(),
		PostID: PostID,
		UserID: UserID,
	}

	result := r.db.Create(&save)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
