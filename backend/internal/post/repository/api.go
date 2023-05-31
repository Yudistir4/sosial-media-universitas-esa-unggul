package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

type PostRepository interface {
	GetPostByID(ID uuid.UUID) (dto.Post, error)
	CreatePost(req dto.CreatePostReq) (dto.Post, error)
	GetPosts(req dto.GetPostsReq) ([]dto.Post, error)
}
