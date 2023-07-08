package impl

import (
	"backend/pkg/dto"

	customerrors "backend/pkg/errors"

	"gorm.io/gorm"
)

func (r *studentRepository) IsBatchExist(BatchYear int) (bool, error) {
	var batch dto.Batch
	result := r.db.Where("year = ?", BatchYear).First(&batch)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return false, nil
		}
		r.log.Errorln("[ERROR] Get Batch Error:", result.Error)
		return false, customerrors.GetErrorType(result.Error)
	}

	return true, nil
}
