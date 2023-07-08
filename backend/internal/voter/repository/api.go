package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type VoterRepository interface {
	CreateVoter(req dto.Voter, tx *gorm.DB) error
	CreateVoters(voters []*dto.Voter, tx *gorm.DB) error
	GetVoter(LoggedInUserID uuid.UUID, PollingID uuid.UUID) (dto.Voter, error)
	DeleteVoters(PollingID uuid.UUID, tx *gorm.DB) error
	IsVoter(LoggedInUserID uuid.UUID, PollingID uuid.UUID) (bool, error)
	Vote(req dto.VoteReq, tx *gorm.DB) error
}
