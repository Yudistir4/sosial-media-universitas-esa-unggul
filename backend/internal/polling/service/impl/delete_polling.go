package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"context"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func (s *pollingService) DeletePolling(req dto.DeletePollingByIDReq) error {

	//  Get Polling
	polling, err := s.repo.GetPollingByID(req.PollingID)
	if err != nil {
		return err
	}
	//  Check user permissions
	if polling.User.ID != req.LoggedInUserID {
		return customerrors.ErrUnauthorizedUserAction
	}
	//  begin tx
	tx := s.db.Begin()
	//  Delete Notifications
	if err = s.repoNotification.DeleteNotificationsByPolling(polling.ID, tx); err != nil {
		tx.Rollback()
		return err
	}
	//  Delete Voters
	if err = s.repoVoter.DeleteVoters(polling.ID, tx); err != nil {
		tx.Rollback()
		return err
	}

	//  Delete Options
	if err = s.repoOption.DeleteOptions(polling.ID, tx); err != nil {
		tx.Rollback()
		return err
	}
	//  Delete Polling
	if err = s.repo.DeletePolling(polling.ID, tx); err != nil {
		tx.Rollback()
		return err
	}

	//  Delete Options Images if exist
	if polling.UseImage {
		for _, option := range polling.Options {
			s.log.Infoln("[INFO] start delete image file]")
			_, err := s.claudinary.Upload.Destroy(context.Background(), uploader.DestroyParams{PublicID: option.ImagePublicID})
			if err != nil {
				tx.Rollback()
				s.log.Errorln("[ERROR] while delete image file]")
				return err
			}

		}

	}
	//  commit
	tx.Commit()

	return nil
}
