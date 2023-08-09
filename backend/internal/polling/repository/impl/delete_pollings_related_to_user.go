package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *pollingRepository) DeletePollingsRelatedToUser(UserID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	result := tx.Where("user_id = ? ", UserID).Delete(&dto.Polling{})
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete Pollings Error:", result.Error)
		return result.Error
	}

	return nil
}
