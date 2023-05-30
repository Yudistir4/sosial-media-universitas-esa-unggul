package impl

import "backend/pkg/dto"

func (s *studyProgramService) GetStudyPrograms() (*[]dto.StudyProgram, error) {
	return s.repo.GetStudyPrograms()
}
