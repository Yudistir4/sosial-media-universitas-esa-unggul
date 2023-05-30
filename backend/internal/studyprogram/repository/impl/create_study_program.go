package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *studyProgramRepository) CreateStudyProgram(req dto.CreateStudyProgramReq) (dto.StudyProgram, error) {

	facultyID, _ := uuid.Parse(req.FacultyID)
	studyProgram := dto.StudyProgram{
		ID:        uuid.New(),
		FacultyID: facultyID,
		Name:      req.Name,
	}
	result := r.db.Create(&studyProgram)
	if result.Error != nil {
		return dto.StudyProgram{}, result.Error
	}
	return studyProgram, nil
}
