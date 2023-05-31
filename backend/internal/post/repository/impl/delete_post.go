package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *postRepository) DeletePost(ID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	result := tx.Delete(&dto.Post{}, ID)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete Post Error:", result.Error)
		return result.Error
	}

	return nil
}
