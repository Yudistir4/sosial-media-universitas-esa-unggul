package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PostRepository interface {
	GetPostByID(ID uuid.UUID) (dto.Post, error)
	CreatePost(req dto.CreatePostReq, tx *gorm.DB) (dto.Post, error)
	UpdatePost(req dto.UpdatePostByIDReq) (dto.Post, error)
	GetPosts(req dto.GetPostsReq) ([]dto.Post, error)
	GetPostsRelatedToUser(UserID uuid.UUID) ([]dto.Post, error)
	DeletePost(ID uuid.UUID, tx *gorm.DB) error
	DeletePostsRelatedToUser(UserID uuid.UUID, tx *gorm.DB) error
}
