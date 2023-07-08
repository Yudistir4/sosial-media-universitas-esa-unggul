package impl

import (
	"backend/pkg/dto"
)

func (s *pollingService) GetFacultysFilter() ([]dto.FacultyFilterResponse, error) {

	return s.repo.GetFacultysFilter()
}
