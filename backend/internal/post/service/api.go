package service

import (
	"backend/pkg/dto"
)

type PostService interface {
	CreatePost(req dto.CreatePostReq) (dto.PostResponse, error)
	GetPostByID(req dto.GetPostByIDReq) (dto.PostResponse, error)
}
