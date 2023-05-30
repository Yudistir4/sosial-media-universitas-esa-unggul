package impl

import "backend/pkg/dto"

func (s *studyProgramService) CreateStudyProgram(req dto.CreateStudyProgramReq) (dto.StudyProgramResponse, error) {
	studyProgram, err := s.repo.CreateStudyProgram(req)
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
