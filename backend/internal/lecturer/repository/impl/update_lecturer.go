package impl

import (
	"backend/pkg/dto"
	"errors"

	customerrors "backend/pkg/errors"

	"gorm.io/gorm"
)

func (r *lecturerRepository) UpdateLecturer(req *dto.UpdateUserReq, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	lecturer, err := r.GetLecturerByID(req.ID)
	if err != nil {
		return err
	}
	// Replace New Data 
	lecturer.NIDN = req.NIDN
	lecturer.FacultyID = req.FacultyID
	lecturer.StudyProgramID = req.StudyProgramID

	result := tx.Save(lecturer)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Update Lecturer Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}

	return nil
}
