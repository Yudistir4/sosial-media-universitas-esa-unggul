package impl

import (
	"backend/pkg/dto"
	"backend/pkg/utils/cloudinaryutils"
	"context"
	"fmt"

	"github.com/google/uuid"
)

func (s *pollingService) CreatePolling(req dto.CreatePollingReq) (*dto.PollingResponse, error) {

	tx := s.db.Begin()
	polling, err := s.repo.CreatePolling(req, tx)

	if err != nil {
		tx.Rollback()
		return nil, err
	}

	var options []*dto.Option
	for i, v := range req.Options {
		option := dto.Option{
			ID:        uuid.New(),
			PollingID: polling.ID,
			Text:      v.Text,
			Position:  i + 1,
		}
		if req.UseImage {
			result, err := cloudinaryutils.UploadFile(cloudinaryutils.UploadParams{Ctx: context.Background(), FilePath: v.ImageSrc, Cld: s.claudinary})
			if err != nil {
				tx.Rollback()
				return nil, err
			}
			option.ImageURL = result.FileURL
			option.ImagePublicID = result.PublicID
		}
		options = append(options, &option)

	}

	err = s.repoOption.CreateOptions(options, tx)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	fmt.Println("is public: ", req.IsPublic)

	if !req.IsPublic {

		var voters []*dto.Voter
		var notifications []*dto.Notification
		for _, v := range req.Voters {
			voter := dto.Voter{
				ID:        uuid.New(),
				PollingID: polling.ID,
				UserID:    v,
				VoteAt:    nil,
			}
			voters = append(voters, &voter)

			notification := dto.Notification{
				ID:         uuid.New(),
				Activity:   "polling",
				FromUserID: req.LoggedInUserID,
				ToUserID:   v,
				PollingID:  &polling.ID,
			}

			notifications = append(notifications, &notification)
		}

		// Create Voters
		err = s.repoVoter.CreateVoters(voters, tx)
		if err != nil {
			tx.Rollback()
			return nil, err
		}

		// Create Notifications
		err = s.repoNotification.CreateNotifications(notifications, tx)
		if err != nil {
			tx.Rollback()
			return nil, err
		}

	}

	tx.Commit()

	return s.GetPollingByID(dto.GetPollingByIDReq{LoggedInUserID: req.LoggedInUserID, PollingID: polling.ID})
}
