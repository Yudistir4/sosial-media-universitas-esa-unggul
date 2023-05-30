package impl

import (
	"backend/pkg/dto"
)

func (r *studyProgramRepository) GetStudyPrograms() (*[]dto.StudyProgram, error) {

	var studyPrograms []dto.StudyProgram
	r.db.Preload("Faculty").Find(&studyPrograms)
	return &studyPrograms, nil
}
