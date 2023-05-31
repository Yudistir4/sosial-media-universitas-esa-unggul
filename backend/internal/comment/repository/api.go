package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

type CommentRepository interface {
	GetComments(req dto.GetCommentsReq) ([]dto.Comment, error)
	GetCommentByID(CommentID uuid.UUID) (dto.Comment, error)
	GetTotalComments(PostID uuid.UUID) (int64, error)
	DeleteCommentByID(CommentID uuid.UUID) error
	CreateComment(req dto.CreateCommentReq) (dto.Comment, error)
}
