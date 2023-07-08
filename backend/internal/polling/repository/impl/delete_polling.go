package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *pollingRepository) DeletePolling(ID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	result := tx.Delete(&dto.Polling{}, ID)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete Polling Error:", result.Error)
		return result.Error
	}

	return nil
}
