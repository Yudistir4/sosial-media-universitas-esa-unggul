package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
)

func (s *postService) CreateComment(req dto.CreateCommentReq) (dto.CommentResponse, error) {
	post, err := s.repo.GetPostByID(req.PostID)
	if err != nil {
		if err == customerrors.ErrPostNotFound {
			return dto.CommentResponse{}, customerrors.ErrPostHasBeenDeleted
		}
		return dto.CommentResponse{}, err
	}

	// begin tx
	tx := s.db.Begin()

	// Create Comment with tx
	comment, err := s.repoComment.CreateComment(req, tx)
	if err != nil {
		tx.Rollback()
		return dto.CommentResponse{}, err
	}

	// Create Notification
	if req.UserID != post.UserID {
		createNotif := dto.CreateNotificationReq{
			FromUserID: req.UserID,
			ToUserID:   post.UserID,
			PostID:     req.PostID,
			CommentID:  &comment.ID,
		}
		if err = s.repoNotification.CreateNotification(createNotif, tx); err != nil {
			tx.Rollback()
			return dto.CommentResponse{}, err
		}
	}

	tx.Commit()

	if comment, err = s.repoComment.GetCommentByID(comment.ID); err != nil {
		return dto.CommentResponse{}, err
	}

	return dto.ConvertCommentToCommentResponse(comment), nil
}
