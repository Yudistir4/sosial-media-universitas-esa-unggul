package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (s *pollingService) GetStudyProgramsFilter(FacultyID uuid.UUID) ([]dto.StudyProgramFilterResponse, error) {

	return s.repo.GetStudyProgramsFilter(FacultyID)
}
