package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"gorm.io/gorm"
)

func (s *postService) UnlikePost(req dto.PostAction) error {
	_, err := s.repo.GetPostByID(req.PostID)
	if err != nil {
		if err == customerrors.ErrPostNotFound {
			return customerrors.ErrPostHasBeenDeleted
		}
		return err
	}
	// get like id
	like, err := s.repoLike.GetLike(req.PostID, req.UserID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return customerrors.ErrPostHasBeenUnliked
		}
	}
	// begin tx
	tx := s.db.Begin()
	// Delete notif tx
	err = s.repoNotification.DeleteNotification(dto.DeleteNotificationReq{LikeID: like.ID}, tx)
	if err != nil {
		s.log.Errorln("[ERROR] error deleting like notification")
		tx.Rollback()
		return err
	}
	// DeleteLike tx
	s.repoLike.DeleteLike(req, tx)
	if err != nil {
		s.log.Errorln("[ERROR] error deleting like")
		tx.Rollback()
		return err
	}
	// Commit
	tx.Commit()

	return nil
}
