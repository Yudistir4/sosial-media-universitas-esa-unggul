package service

import (
	"backend/pkg/dto"
)

type PostService interface {
	CreatePost(req dto.CreatePostReq) (dto.PostResponse, error)
	GetPostByID(req dto.GetPostByIDReq) (dto.PostResponse, error)
	GetPosts(req dto.GetPostsReq) ([]dto.PostResponse, error)
	UpdatePost(req dto.UpdatePostByIDReq) (dto.PostResponse, error)
	LikePost(req dto.PostAction) error
	UnlikePost(req dto.PostAction) error
	SavePost(req dto.PostAction) error
	UnsavePost(req dto.PostAction) error
	CreateComment(req dto.CreateCommentReq) (dto.CommentResponse, error)
	GetComments(req dto.GetCommentsReq) ([]dto.CommentResponse, error)
	DeleteComment(req dto.DeleteCommentReq) error
}
