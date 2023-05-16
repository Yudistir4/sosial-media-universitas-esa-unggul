package dto

import "github.com/google/uuid"

type Student struct {
	ID             uuid.UUID
	Nim            string `validate:"required"`
	Angkatan       int    `validate:"required"`
	FacultyID      uuid.UUID
	Faculty        Faculty `gorm:"foreignKey:FacultyID"`
	StudyProgramID uuid.UUID
	StudyProgram   StudyProgram `gorm:"foreignKey:StudyProgramID"`
}
