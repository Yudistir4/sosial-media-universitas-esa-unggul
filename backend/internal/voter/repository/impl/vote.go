package impl

import (
	"backend/pkg/dto"

	"gorm.io/gorm"
)

func (r *voterRepository) Vote(req dto.VoteReq, tx *gorm.DB) error {

	voter, err := r.GetVoter(req.LoggedInUserID, req.PollingID)
	if err != nil {
		return err
	}

	voter.OptionID = &req.OptionID

	result := tx.Save(&voter)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil
		}
		return result.Error
	}
	return nil
}
