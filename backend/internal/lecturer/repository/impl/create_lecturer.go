package impl

import (
	"backend/pkg/dto"
	"errors"

	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *lecturerRepository) CreateLecturer(req dto.CreateUserReq, tx *gorm.DB) (dto.Lecturer, error) {
	if tx == nil {
		return dto.Lecturer{}, errors.New("transaction not started")
	}
	facultyID, _ := uuid.Parse(req.FacultyID)
	studyProgramID, _ := uuid.Parse(req.StudyProgramID)
	lecturer := dto.Lecturer{
		ID:             uuid.New(),
		FacultyID:      facultyID,
		StudyProgramID: studyProgramID,
		NIDN:           req.NIDN,
	}
	result := tx.Create(&lecturer)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Create Lecturer Error:", result.Error)
		return lecturer, customerrors.GetErrorType(result.Error)
	}

	return lecturer, nil
}
