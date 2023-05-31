package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

type LikeRepository interface {
	CheckIsLiked(PostID uuid.UUID, UserID uuid.UUID) (bool, error)
	GetTotalLikes(PostID uuid.UUID) (int64, error)
	CreateLike(req dto.PostAction) error
	DeleteLike(req dto.PostAction) error
}
