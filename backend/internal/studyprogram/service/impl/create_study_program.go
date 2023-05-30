package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
)

func (s *studyProgramService) CreateStudyProgram(req dto.CreateStudyProgramReq) (dto.StudyProgramResponse, error) {
	_, err := s.repo.GetStudyProgramByName(req.Name)
	if err != nil {
		if err != customerrors.ErrStudyProgramNotFound {
			return dto.StudyProgramResponse{}, err
		}
	} else if err == nil {
		return dto.StudyProgramResponse{}, customerrors.ErrDuplicatedStudyProgramName
	}

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
