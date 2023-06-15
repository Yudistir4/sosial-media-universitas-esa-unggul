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
	Faculty   Faculty `gorm:"ForeignKey:FacultyID"`
	Name      string  `validate:"required"`
}
type CreateStudyProgramReq struct {
	FacultyID string `json:"faculty_id"`
	Name      string `json:"name"`
}
type DeleteStudyProgramReq struct {
	ID uuid.UUID `param:"id"`
}

type GetStudyProgramsReq struct {
	FacultyID uuid.UUID `query:"faculty_id"`
}
type UpdateStudyProgramNameReq struct {
	ID   uuid.UUID `param:"id" validate:"required"`
	Name string    `json:"name" validate:"required"`
}

type StudyProgramResponse struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Faculty   Faculty   `json:"faculty"`
	Name      string    `json:"name"`
}
