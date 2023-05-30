package impl

import (
	"backend/pkg/dto"
	"errors"

	customerrors "backend/pkg/errors"

	"gorm.io/gorm"
)

func (r *studentRepository) UpdateStudent(req *dto.UpdateUserReq, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	student, err := r.GetStudentByID(req.ID)
	if err != nil {
		return err
	}
	// Replace New Data 
	student.NIM = req.NIM
	student.Angkatan = req.Angkatan
	student.FacultyID = req.FacultyID
	student.StudyProgramID = req.StudyProgramID

	result := tx.Save(student)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Update Student Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}

	return nil
}
