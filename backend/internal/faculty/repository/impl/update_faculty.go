package impl

import (
	"backend/pkg/dto"
	"errors"

	customerrors "backend/pkg/errors"

	"gorm.io/gorm"
)

func (r *facultyRepository) UpdateFaculty(req *dto.UpdateUserReq, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	faculty, err := r.GetFacultyByID(req.ID)
	if err != nil {
		return err
	}
	// Replace New Data
	faculty.Name = req.Name

	result := tx.Save(faculty)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Update Faculty Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}

	return nil
}
