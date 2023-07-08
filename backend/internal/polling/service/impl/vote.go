package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (s *pollingService) Vote(req dto.VoteReq) error {
	// TODO Get polling by id
	polling, err := s.repo.GetPollingByID(req.PollingID)
	if err != nil {
		return err
	}
	// TODO start TX
	tx := s.db.Begin()

	// TODO if public -> create voter
	if polling.IsPublic {
		currentTime := time.Now()
		err := s.repoVoter.CreateVoter(dto.Voter{
			ID:        uuid.New(),
			PollingID: req.PollingID,
			UserID:    req.LoggedInUserID,
			OptionID:  &req.OptionID,
			VoteAt:    &currentTime,
		}, tx)

		if err != nil {
			tx.Rollback()
			return err
		}

	} else {
		// TODO if no public
		// TODO get vote by user_id and polling_id
		// TODO if not found -> return error not allowed
		// TODO if found -> update vote
		err := s.repoVoter.Vote(req, tx)
		if err != nil {
			tx.Rollback()
			if err == gorm.ErrRecordNotFound {
				return customerrors.ErrUnauthorizedRole
			}
		}

	}

	// TODO create notif
	err = s.repoNotification.CreateNotification(dto.CreateNotificationReq{
		Activity:   "vote",
		FromUserID: req.LoggedInUserID,
		ToUserID:   polling.UserID,
		PollingID:  &req.PollingID,
		OptionID:   &req.OptionID,
	}, tx)

	if err != nil {
		tx.Rollback()
		return err
	}
	// TODO commit TX
	tx.Commit()

	return nil
}
