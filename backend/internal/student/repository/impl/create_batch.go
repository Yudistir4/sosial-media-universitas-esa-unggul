package impl

import (
	"backend/pkg/dto"

	customerrors "backend/pkg/errors"

	"gorm.io/gorm"
)

func (r *studentRepository) CreateBatch(BatchYear int, tx *gorm.DB) error {
	batch := dto.Batch{Year: BatchYear}
	result := tx.Create(&batch)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Get Batch Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}

	return nil
}
