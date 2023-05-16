package dto

import (
	"time"

	"github.com/google/uuid"
)

type StudyProgram struct {
	ID        uuid.UUID
	CreatedAt time.Time
	UpdatedAt time.Time
	FacultyID uuid.UUID
	Faculty   Faculty
	Name      string `validate:"required"`
}
