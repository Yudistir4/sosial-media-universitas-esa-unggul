package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *studyProgramRepository) GetStudyPrograms(req dto.GetStudyProgramsReq) (*[]dto.StudyProgram, error) {

	var studyPrograms []dto.StudyProgram
	query := r.db.Preload("Faculty")
	if req.FacultyID != uuid.Nil {
		query = query.Where("faculty_id = ?", req.FacultyID)
	}
	query.Find(&studyPrograms)
	return &studyPrograms, nil
}
