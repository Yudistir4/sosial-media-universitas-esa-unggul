package dto

import "github.com/google/uuid"

type Student struct {
	ID             uuid.UUID `gorm:"type:char(36);primary_key"`
	NIM            string    `gorm:"unique" validate:"required"`
	Angkatan       int       `validate:"required"`
	FacultyID      uuid.UUID
	Faculty        Faculty `gorm:"foreignKey:FacultyID"`
	StudyProgramID uuid.UUID
	StudyProgram   StudyProgram `gorm:"foreignKey:StudyProgramID"`
}

type CreateStudentReq struct {
	Nim            string
	Angkatan       int
	FacultyID      uuid.UUID
	StudyProgramID uuid.UUID
}

type StudentResponse struct {
	ID           uuid.UUID            `json:"id"`
	NIM          string               `json:"nim"`
	Angkatan     int                  `json:"angkatan"`
	Faculty      FacultyResponse      `json:"faculty"`
	StudyProgram StudyProgramResponse `json:"study_program"`
}
