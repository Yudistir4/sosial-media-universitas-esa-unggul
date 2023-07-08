package impl

import "github.com/google/uuid"

func (s *pollingService) GetBatchesFilter(FacultyID uuid.UUID, StudyProgramID uuid.UUID) ([]int, error) {

	return s.repo.GetBatchesFilter(FacultyID, StudyProgramID)
}
