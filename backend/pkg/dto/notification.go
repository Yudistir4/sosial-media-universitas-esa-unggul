package dto

import (
	"time"

	"github.com/google/uuid"
)

type Notification struct {
	ID         uuid.UUID `gorm:"type:char(36);primary_key"`
	Activity   string    `gorm:"type:varchar(10);enum('like', 'comment','ask','polling','vote')"`
	IsRead     bool
	CreatedAt  time.Time
	UpdatedAt  time.Time
	FromUserID uuid.UUID
	FromUser   User `gorm:"ForeignKey:FromUserID"`
	ToUserID   uuid.UUID
	ToUser     User `gorm:"ForeignKey:ToUserID"`
	PostID     *uuid.UUID
	Post       Post `gorm:"ForeignKey:PostID"`
	CommentID  *uuid.UUID
	Comment    Comment `gorm:"ForeignKey:CommentID"`
	LikeID     *uuid.UUID
	Like       Like `gorm:"ForeignKey:LikeID"`
	PollingID  *uuid.UUID
	Polling    Polling `gorm:"ForeignKey:PollingID"`
	OptionID   *uuid.UUID
	Option     Option `gorm:"ForeignKey:OptionID"`
}
type CreateNotificationReq struct {
	FromUserID uuid.UUID
	ToUserID   uuid.UUID
	PostID     *uuid.UUID
	PollingID  *uuid.UUID
	Activity   string
	CommentID  *uuid.UUID
	LikeID     *uuid.UUID
	OptionID   *uuid.UUID
}

type DeleteNotificationReq struct {
	CommentID uuid.UUID
	LikeID    uuid.UUID
}
type NotificationPostResponse struct {
	ID             uuid.UUID `json:"id"`
	Caption        string    `json:"caption"`
	ContentFileURL string    `json:"content_file_url"`
	ContentType    string    `json:"content_type"`
	PostCategory   string    `json:"post_category"`
}
type NotificationCommentResponse struct {
	ID      uuid.UUID `json:"id"`
	Comment string    `json:"comment"`
}
type NotificationResponse struct {
	ID        uuid.UUID                   `json:"id"`
	Activity  string                      `json:"activity"`
	IsRead    bool                        `json:"is_read"`
	CreatedAt time.Time                   `json:"created_at"`
	UpdatedAt time.Time                   `json:"updated_at"`
	FromUser  PostUserResponse            `json:"from_user"` // id, name, profile pic
	Post      NotificationPostResponse    `json:"post"`      // id,postPic,
	Comment   NotificationCommentResponse `json:"comment"`
	Message   string                      `json:"message"`
	PollingID *uuid.UUID                  `json:"polling_id"`
}

type GetNotificationsReq struct {
	UserID uuid.UUID `validate:"required"`
	Page   int       `query:"page"`
	Limit  int       `query:"limit"`
}
