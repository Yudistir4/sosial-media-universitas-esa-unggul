package impl

import (
	"backend/pkg/dto"
	"errors"

	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *studentRepository) CreateStudent(req dto.CreateUserReq, tx *gorm.DB) (dto.Student, error) {
	if tx == nil {
		return dto.Student{}, errors.New("transaction not started")
	}
	ok, err := r.IsBatchExist(req.BatchYear)
	if err != nil {
		return dto.Student{}, err
	}
	if !ok {
		if err = r.CreateBatch(req.BatchYear, tx); err != nil {
			return dto.Student{}, err
		}
	}

	facultyID, _ := uuid.Parse(req.FacultyID)
	studyProgramID, _ := uuid.Parse(req.StudyProgramID)
	student := dto.Student{
		ID:             uuid.New(),
		FacultyID:      facultyID,
		StudyProgramID: studyProgramID,
		NIM:            req.NIM,
		BatchYear:      req.BatchYear,
	}
	result := tx.Create(&student)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Create Student Error:", result.Error)
		return student, customerrors.GetErrorType(result.Error)
	}

	return student, nil
}
