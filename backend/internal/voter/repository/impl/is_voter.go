package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *voterRepository) IsVoter(LoggedInUserID uuid.UUID, PollingID uuid.UUID) (bool, error) {

	var voter dto.Voter
	result := r.db.Where("polling_id = ? AND user_id = ? ", PollingID, LoggedInUserID).First(&voter)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return false, nil
		}
		return false, result.Error
	}
	return true, nil
}
