package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
)

func (s *postService) LikePost(req dto.PostAction) error {
	post, err := s.repo.GetPostByID(req.PostID)
	if err != nil {
		if err == customerrors.ErrPostNotFound {
			return   customerrors.ErrPostHasBeenDeleted
		}
		return   err
	}

	// begin tx
	tx := s.db.Begin()

	like,err := s.repoLike.CreateLike(req,tx)
	if err != nil {
		tx.Rollback()
		return   err
	}
	 // Create Notification
	if req.UserID != post.UserID {
		createNotif := dto.CreateNotificationReq{
			FromUserID: req.UserID,
			ToUserID:   post.UserID,
			PostID:     &req.PostID,
			LikeID:  &like.ID,
		}
		if err = s.repoNotification.CreateNotification(createNotif, tx); err != nil {
			tx.Rollback()
			return  err
		}
	}

	tx.Commit()

	return nil
}
