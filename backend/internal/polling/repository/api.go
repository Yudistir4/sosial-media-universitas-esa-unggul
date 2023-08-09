package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PollingRepository interface {
	GetPollingByID(ID uuid.UUID) (dto.Polling, error)
	CreatePolling(req dto.CreatePollingReq, tx *gorm.DB) (dto.Polling, error)
	GetPollings(req dto.GetPollingsReq) ([]dto.Polling, error)
	DeletePolling(ID uuid.UUID, tx *gorm.DB) error
	DeletePollingsRelatedToUser(UserID uuid.UUID, tx *gorm.DB) error
	GetFacultysFilter() ([]dto.FacultyFilterResponse, error)
	GetStudyProgramsFilter(FacultyID uuid.UUID) ([]dto.StudyProgramFilterResponse, error)
	GetBatchesFilter(FacultyID uuid.UUID, StudyProgramID uuid.UUID) ([]int, error)
}
