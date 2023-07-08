package impl

import (
	"backend/pkg/dto"
	"errors"

	"gorm.io/gorm"
)

func (r *optionRepository) CreateOptions(options []*dto.Option, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	result := tx.Create(&options)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
