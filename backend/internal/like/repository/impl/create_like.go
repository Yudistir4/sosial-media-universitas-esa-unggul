package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *likeRepository) CreateLike(req dto.PostAction, tx *gorm.DB) (dto.Like, error) {
	if tx == nil {
		return dto.Like{}, errors.New("transaction not started")
	}
	ok, err := r.CheckIsLiked(req.PostID, req.UserID)
	if err != nil {
		return dto.Like{}, err
	}
	if ok {
		return dto.Like{}, customerrors.ErrPostHasBeenLiked
	}
	like := dto.Like{
		ID:     uuid.New(),
		PostID: req.PostID,
		UserID: req.UserID,
	}

	result := tx.Create(&like)
	if result.Error != nil {
		return dto.Like{}, result.Error
	}
	return like, nil
}
