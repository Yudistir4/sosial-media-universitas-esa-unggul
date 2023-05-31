package dto

import "github.com/google/uuid"

type Like struct {
	ID     uuid.UUID `gorm:"type:char(36);primary_key"`
	PostID uuid.UUID
	Post   Post `gorm:"ForeignKey:PostID"`
	UserID uuid.UUID
	User   User `gorm:"ForeignKey:UserID"`
}


type LikePost struct {
	PostAction
}

type UnlikePost struct {
	PostAction
}

