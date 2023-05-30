package dto

import (
	"time"

	"github.com/google/uuid"
)

type Faculty struct {
	ID        uuid.UUID `gorm:"type:char(36);primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time
	Name      string `validate:"required"`
}
type FacultyResponse struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Name      string    `json:"name"`
}
