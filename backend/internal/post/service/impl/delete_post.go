package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"context"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func (s *postService) DeletePost(req dto.PostAction) error {

	// check post is exist
	post, err := s.repo.GetPostByID(req.PostID)
	if err != nil {
		return err
	}

	// check user authorize
	if post.UserID != req.UserID {
		s.log.Warningln("[ERROR] Unauthorized user")
		return customerrors.ErrUnauthorizedUserAction
	}

	// initiate tx
	tx := s.db.Begin()
	// delete likes tx
	if err = s.repoLike.DeleteLikes(req.PostID, tx); err != nil {
		tx.Rollback()
		return err
	}
	// delete saves tx
	if err = s.repoSave.DeleteSaves(req.PostID, tx); err != nil {
		tx.Rollback()
		return err
	}

	// delete comments tx
	if err = s.repoComment.DeleteComments(req.PostID, tx); err != nil {
		tx.Rollback()
		return err
	}

	// delete post tx
	if err = s.repo.DeletePost(req.PostID, tx); err != nil {
		tx.Rollback()
		return err
	}

	// if content file exist, delete it
	if post.ContentFilePublicID != "" {
		s.log.Infoln("[INFO] start delete content file]")
		_, err := s.claudinary.Upload.Destroy(context.Background(), uploader.DestroyParams{PublicID: post.ContentFilePublicID})
		if err != nil {
			tx.Rollback()
			s.log.Errorln("[ERROR] while delete content file]")
			return err
		}

	}

	// commit transaction
	tx.Commit()
	return nil
}
