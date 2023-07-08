package impl

import (
	"backend/pkg/dto"

	"gorm.io/gorm"
)

func (s *pollingService) GetPollings(req dto.GetPollingsReq) (*[]dto.PollingResponse, error) {

	pollings, err := s.repo.GetPollings(req)
	if err != nil {
		return nil, err
	}

	var pollingsResponse []dto.PollingResponse
	for _, polling := range pollings {
		pollingResponse := dto.ConvertPollingToPollingResponse(&polling)
		for i, v := range pollingResponse.Options {
			pollingResponse.Options[i].TotalVoters, err = s.repoOption.TotalVoters(v.ID)
		}
		voter, err := s.repoVoter.GetVoter(req.LoggedInUserID, polling.ID)
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
			pollingResponse.IsVoter = true
		} else if !pollingResponse.IsPublic && req.LoggedInUserID != pollingResponse.User.ID {
			pollingResponse.IsVoter, err = s.repoVoter.IsVoter(req.LoggedInUserID, polling.ID)
			if err != nil {
				return nil, err
			}
		}

		pollingsResponse = append(pollingsResponse, *pollingResponse)

	}

	return &pollingsResponse, nil
}
