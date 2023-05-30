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
 