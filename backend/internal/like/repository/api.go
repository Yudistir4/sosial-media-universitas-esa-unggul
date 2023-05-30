package repository

import (
	"github.com/google/uuid"
)

type LikeRepository interface {
	CheckIsLiked(PostID uuid.UUID, UserID uuid.UUID) (bool, error)
	GetTotalLikes(PostID uuid.UUID) (int64, error)
	CreateLike(PostID uuid.UUID, UserID uuid.UUID) error
	DeleteLike(PostID uuid.UUID, UserID uuid.UUID) error
}
