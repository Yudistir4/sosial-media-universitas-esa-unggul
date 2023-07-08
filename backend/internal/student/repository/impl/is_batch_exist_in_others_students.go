package impl

import (
	"backend/pkg/dto"

	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *studentRepository) IsBatchExistInOthersStudents(BatchYear int, ExcludedID uuid.UUID) (bool, error) {
	var student dto.Student
	result := r.db.Where("batch_year = ? && id != ?", BatchYear, ExcludedID).First(&student)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return false, nil
		}
		r.log.Errorln("[ERROR] Get Batch In Students Error:", result.Error)
		return false, customerrors.GetErrorType(result.Error)
	}

	return true, nil
}
