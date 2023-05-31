package dto

import (
	"time"

	"github.com/google/uuid"
)

type Comment struct {
	ID        uuid.UUID `gorm:"type:char(36);primary_key"`
	PostID    uuid.UUID
	Post      Post `gorm:"ForeignKey:PostID"`
	UserID    uuid.UUID
	User      User `gorm:"ForeignKey:UserID"`
	CreatedAt time.Time
	Comment   string
}

type CommentResponse struct {
	ID        uuid.UUID        `json:"id"`
	Comment   string           `json:"comment"`
	CreatedAt time.Time        `json:"created_at"`
	User      PostUserResponse `json:"user"`
}

type CreateCommentReq struct {
	PostAction
	Comment string `json:"comment" validate:"required"`
}

type GetCommentsReq struct {
	PostID uuid.UUID `param:"id"`
	Page   int       `query:"page"`
	Limit  int       `query:"limit"`
}
type DeleteCommentReq struct {
	CommentID uuid.UUID `param:"comment_id" validate:"required"`
	PostID    uuid.UUID `param:"post_id" validate:"required"`
	UserID    uuid.UUID
}

func ConvertCommentToCommentResponse(comment Comment) CommentResponse {
	return CommentResponse{
		ID:        comment.ID,
		CreatedAt: comment.CreatedAt,
		Comment:   comment.Comment,
		User: PostUserResponse{
			ID:            comment.User.ID,
			Name:          comment.User.Name,
			ProfilePicURL: comment.User.ProfilePicURL,
		},
	}
}
