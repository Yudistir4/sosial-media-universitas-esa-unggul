package impl

import (
	"errors"

	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *lecturerRepository) DeleteLecturerByID(ID uuid.UUID, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	lecturer, err := r.GetLecturerByID(ID)
	if err != nil {
		return err
	}

	result := tx.Delete(&lecturer)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Delete Lecturer Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}

	return nil
}
