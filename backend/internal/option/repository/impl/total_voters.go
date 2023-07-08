package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *optionRepository) TotalVoters(OptionID uuid.UUID) (int64, error) {

	var count int64
	err := r.db.Model(&dto.Voter{}).Where("option_id = ?",OptionID).Count(&count).Error
	if err != nil {
		return 0, err
	}
	return count, nil

}
