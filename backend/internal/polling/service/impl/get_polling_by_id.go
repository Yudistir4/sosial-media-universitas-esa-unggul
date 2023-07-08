package impl

import (
	"backend/pkg/dto"

	"gorm.io/gorm"
)

func (s *pollingService) GetPollingByID(req dto.GetPollingByIDReq) (*dto.PollingResponse, error) {

	polling, err := s.repo.GetPollingByID(req.PollingID)
	if err != nil {
		return nil, err
	}

	pollingResponse := dto.ConvertPollingToPollingResponse(&polling)
	for i, v := range pollingResponse.Options {
		pollingResponse.Options[i].TotalVoters, err = s.repoOption.TotalVoters(v.ID)
	}

	voter, err := s.repoVoter.GetVoter(req.LoggedInUserID, req.PollingID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			pollingResponse.UserChoice = nil
		} else {

			return nil, err
		}
	} else {
		pollingResponse.UserChoice = dto.ConvertVoterToVoterResponse(&voter)
	}

	if req.LoggedInUserID == pollingResponse.User.ID {
		pollingResponse.IsVoter = false
	} else if pollingResponse.IsPublic && req.LoggedInUserID != pollingResponse.User.ID {
		pollingResponse.IsPublic = true
	} else if !pollingResponse.IsPublic && req.LoggedInUserID != pollingResponse.User.ID {
		// check in the voters
		pollingResponse.IsVoter, err = s.repoVoter.IsVoter(req.LoggedInUserID, req.PollingID)
		if err != nil {
			return nil, err
		}
	}
	return pollingResponse, nil
}
