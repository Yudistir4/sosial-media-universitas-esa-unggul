package dto

import (
	"mime/multipart"
	"time"

	"github.com/google/uuid"
)

var (
	PostCategory = []string{"seminar", "beasiswa", "magang", "lomba"}
)

func CheckPostCategory(cat string) bool {
	for _, v := range PostCategory {
		if v == cat {
			return true
		} 
	}
	return false
}

type Post struct {
	ID                  uuid.UUID `gorm:"type:char(36);primary_key"`
	CreatedAt           time.Time
	UpdatedAt           time.Time
	Caption             string `gorm:"type:text"`
	ContentFileURL      string
	ContentFilePublicID string
	ContentType         string `gorm:"type:varchar(10);enum:video,image"`
	PostCategory        string
	UserID              uuid.UUID
	User                User `gorm:"ForeignKey:UserID"`
}

type CreatePostReq struct {
	Caption             string `form:"caption" validate:"required"`
	ContentFile         *multipart.FileHeader
	ContentFileSrc      string
	UserID              uuid.UUID `validate:"required"`
	ContentType         string
	ContentFileURL      string
	ContentFilePublicID string
	PostCategory        string `form:"post_category"`
}

type PostResponse struct {
	ID             uuid.UUID        `json:"id"`
	CreatedAt      time.Time        `json:"created_at"`
	UpdatedAt      time.Time        `json:"updated_at"`
	Caption        string           `json:"caption"`
	ContentFileURL string           `json:"content_file_url"`
	ContentType    string           `json:"content_type"`
	PostCategory   string           `json:"post_category"`
	IsSaved        bool             `json:"is_saved"`
	IsLiked        bool             `json:"is_liked"`
	User           PostUserResponse `json:"user"`
}

type PostUserResponse struct {
	ID            uuid.UUID `json:"id"`
	Name          string    `json:"name"`
	ProfilePicURL string    `json:"profile_pic_url"`
}