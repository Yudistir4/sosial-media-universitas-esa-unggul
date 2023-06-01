package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
)

func (s *postService) DeleteComment(req dto.DeleteCommentReq) error {
	if _, err := s.repo.GetPostByID(req.PostID); err != nil {
		if err == customerrors.ErrPostNotFound {
			return customerrors.ErrPostHasBeenDeleted
		}
		return err
	}

	comment, err := s.repoComment.GetCommentByID(req.CommentID)
	if err != nil {
		if err == customerrors.ErrCommentNotFound {
			return customerrors.ErrCommentHasBeenDeleted
		}
		return err
	}

	if comment.UserID != req.UserID {
		return customerrors.ErrUnauthorizedUserAction
	}

	// begin transaction
	tx := s.db.Begin()
	if err = s.repoNotification.DeleteNotification(dto.DeleteNotificationReq{CommentID: req.CommentID}, tx); err != nil {
		tx.Rollback()
		return err
	}
	if err = s.repoComment.DeleteCommentByID(req.CommentID, tx); err != nil {
		tx.Rollback()
		return err
	}
	tx.Commit()

	return nil
}
