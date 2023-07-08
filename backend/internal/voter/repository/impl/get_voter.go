package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *voterRepository) GetVoter(LoggedInUserID uuid.UUID, PollingID uuid.UUID) (dto.Voter, error) {

	var voter dto.Voter
	result := r.db.Where("polling_id = ? AND user_id = ? ", PollingID, LoggedInUserID).First(&voter)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return dto.Voter{}, result.Error
		}
		return dto.Voter{}, result.Error
	}
	return voter, nil
}
