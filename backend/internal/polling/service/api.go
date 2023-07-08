package service

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

type PollingService interface {
	CreatePolling(req dto.CreatePollingReq) (*dto.PollingResponse, error)
	GetPollingByID(req dto.GetPollingByIDReq) (*dto.PollingResponse, error)
	GetPollings(req dto.GetPollingsReq) (*[]dto.PollingResponse, error)
	DeletePolling(req dto.DeletePollingByIDReq) error
	Vote(req dto.VoteReq) error
	GetFacultysFilter() ([]dto.FacultyFilterResponse, error)
	GetStudyProgramsFilter(FacultyID uuid.UUID) ([]dto.StudyProgramFilterResponse, error)
	GetBatchesFilter(FacultyID uuid.UUID, StudyProgramID uuid.UUID) ([]int, error) 
	 
}
