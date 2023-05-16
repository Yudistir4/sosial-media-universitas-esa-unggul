package dto

import (
	"time"

	"github.com/google/uuid"
)

type Faculty struct {
	ID        uuid.UUID
	CreatedAt time.Time
	UpdatedAt time.Time
	Name      string `validate:"required"`
}
