package impl

import (
	"backend/pkg/dto"
)

func (s *studyProgramService) UpdateStudyProgramName(req dto.UpdateStudyProgramNameReq) (dto.StudyProgramResponse, error) {
	studyProgram, err := s.repo.UpdateStudyProgramName(req)
	if err != nil {
		return dto.StudyProgramResponse{}, err
	}
	studyProgramResponse := dto.StudyProgramResponse{
		ID:        studyProgram.ID,
		Name:      studyProgram.Name,
		Faculty:   studyProgram.Faculty,
		CreatedAt: studyProgram.CreatedAt,
		UpdatedAt: studyProgram.UpdatedAt,
	}
	return studyProgramResponse, nil
}
