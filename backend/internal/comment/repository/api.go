package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CommentRepository interface {
	GetComments(req dto.GetCommentsReq) ([]dto.Comment, error)
	GetCommentByID(CommentID uuid.UUID) (dto.Comment, error)
	GetTotalComments(PostID uuid.UUID) (int64, error)
	DeleteCommentByID(CommentID uuid.UUID,tx *gorm.DB) error
	CreateComment(req dto.CreateCommentReq,tx *gorm.DB) (dto.Comment, error)
	DeleteComments(PostID uuid.UUID, tx *gorm.DB) error
}
