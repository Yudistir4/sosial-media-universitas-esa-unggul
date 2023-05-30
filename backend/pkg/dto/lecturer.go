package dto

import "github.com/google/uuid"

type Lecturer struct {
	ID             uuid.UUID `gorm:"type:char(36);primary_key"`
	NIDN           string    `gorm:"unique;column:nidn" validate:"required"`
	FacultyID      uuid.UUID
	Faculty        Faculty `gorm:"foreignKey:FacultyID"`
	StudyProgramID uuid.UUID
	StudyProgram   StudyProgram `gorm:"foreignKey:StudyProgramID"`
}

type CreateLecturerReq struct {
	NIDN           string
	FacultyID      uuid.UUID
	StudyProgramID uuid.UUID
}

type LecturerResponse struct {
	ID           uuid.UUID            `json:"id"`
	NIDN         string               `json:"nidn"`
	Faculty      FacultyResponse      `json:"faculty"`
	StudyProgram StudyProgramResponse `json:"study_program"`
}
