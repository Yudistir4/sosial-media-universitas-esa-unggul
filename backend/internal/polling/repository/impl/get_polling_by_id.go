package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *pollingRepository) GetPollingByID(ID uuid.UUID) (dto.Polling, error) {

	var polling dto.Polling
	result := r.db.Preload("User").Preload("Options", func(db *gorm.DB) *gorm.DB {
		return db.Order("position ASC")
	}).First(&polling, ID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return dto.Polling{}, customerrors.ErrPollingNotFound
		}
		return dto.Polling{}, result.Error
	}
	return polling, nil
}
