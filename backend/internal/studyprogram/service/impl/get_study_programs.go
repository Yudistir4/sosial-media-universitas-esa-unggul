package impl

import "backend/pkg/dto"

func (s *studyProgramService) GetStudyPrograms(req dto.GetStudyProgramsReq) (*[]dto.StudyProgramResponse, error) {
	studyprograms, err := s.repo.GetStudyPrograms(req)
	if err != nil {
		return nil, err
	}
	var studyProgramsRes []dto.StudyProgramResponse
	for _, v := range *studyprograms {
		studyProgramsRes = append(studyProgramsRes, dto.StudyProgramResponse{
			ID:        v.ID,
			CreatedAt: v.CreatedAt,
			UpdatedAt: v.UpdatedAt,
			Faculty:   v.Faculty,
			Name:      v.Name,
		})
	}

	return &studyProgramsRes, nil
}
