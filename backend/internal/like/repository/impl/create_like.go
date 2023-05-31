package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
)

func (r *likeRepository) CreateLike(req dto.PostAction) error {

	ok, err := r.CheckIsLiked(req.PostID, req.UserID)
	if err != nil {
		return err
	}
	if ok {
		return customerrors.ErrPostHasBeenLiked
	}
	like := dto.Like{
		ID:     uuid.New(),
		PostID: req.PostID,
		UserID: req.UserID,
	}

	result := r.db.Create(&like)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
