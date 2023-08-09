package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type LikeRepository interface {
	CheckIsLiked(PostID uuid.UUID, UserID uuid.UUID) (bool, error)
	GetLike(PostID uuid.UUID, UserID uuid.UUID) (dto.Like, error)
	GetTotalLikes(PostID uuid.UUID) (int64, error)
	CreateLike(req dto.PostAction, tx *gorm.DB) (dto.Like, error)
	DeleteLike(req dto.PostAction, tx *gorm.DB) error
	DeleteLikes(PostID uuid.UUID, tx *gorm.DB) error
	DeleteLikesRelatedToUser(UserID uuid.UUID, tx *gorm.DB) error
}
