package impl

import (
	"backend/pkg/dto"

	customerrors "backend/pkg/errors"

	"gorm.io/gorm"
)

func (r *studentRepository) DeleteBatch(BatchYear int, tx *gorm.DB) error {
	var batch dto.Batch
	result := tx.Where("year = ?", BatchYear).Delete(&batch)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Get Batch Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}

	return nil
}
