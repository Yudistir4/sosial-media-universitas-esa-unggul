package impl

import (
	"backend/pkg/dto"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *optionRepository) DeleteOptions(PollingID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	result := tx.Where("polling_id = ?", PollingID).Delete(&dto.Option{})
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete Options Error:", result.Error)
		return result.Error
	}
	return nil
}
