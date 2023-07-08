package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OptionRepository interface {
	CreateOptions(options []*dto.Option, tx *gorm.DB) error
	DeleteOptions(PollingID uuid.UUID, tx *gorm.DB) error
	TotalVoters(OptionID uuid.UUID) (int64, error) 
}
