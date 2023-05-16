package dto

import (
	"time"

	"github.com/google/uuid"
)

type StudyProgram struct {
	ID        uuid.UUID `gorm:"type:char(36);primary_key"`
	CreatedAt time.Time
	UpdatedAt time.Time
	FacultyID uuid.UUID
	Faculty   Faculty
	Name      string `validate:"required"`
}
