package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"gorm.io/gorm"
)

func (r *likeRepository) DeleteLike(req dto.PostAction, tx *gorm.DB) error {
	ok, err := r.CheckIsLiked(req.PostID, req.UserID)
	if err != nil {
		return err
	}
	if !ok {
		return customerrors.ErrPostHasBeenUnliked
	}
	result := tx.Where("post_id = ? AND user_id = ?", req.PostID, req.UserID).Delete(&dto.Like{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}
