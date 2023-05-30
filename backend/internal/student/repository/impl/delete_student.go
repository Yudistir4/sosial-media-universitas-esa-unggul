package impl

import (
	"errors"

	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *studentRepository) DeleteStudentByID(ID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	student, err := r.GetStudentByID(ID)
	if err != nil {
		return err
	}

	result := tx.Delete(&student)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete Student Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}

	return nil
}
