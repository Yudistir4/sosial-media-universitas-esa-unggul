package repository

import (
	"github.com/google/uuid"
)

type CommentRepository interface {
	GetTotalComments(PostID uuid.UUID) (int64, error)
	DeleteCommentByID(CommentID uuid.UUID) error
}
