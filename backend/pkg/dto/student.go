package dto

import "github.com/google/uuid"

type Student struct {
	ID             uuid.UUID `gorm:"type:char(36);primary_key"`
	NIM            string    `gorm:"unique" validate:"required"`
	IsGraduated    bool
	BatchYear      int
	Batch          Batch `gorm:"foreignKey:BatchYear"`
	FacultyID      uuid.UUID
	Faculty        Faculty `gorm:"foreignKey:FacultyID"`
	StudyProgramID uuid.UUID
	StudyProgram   StudyProgram `gorm:"foreignKey:StudyProgramID"`
}

type CreateStudentReq struct {
	Nim            string
	IsGraduated    bool
	FacultyID      uuid.UUID
	StudyProgramID uuid.UUID
}

type Batch struct {
	Year int `gorm:"primary_key;type:int"`
}

type StudentResponse struct {
	ID          uuid.UUID `json:"id"`
	NIM         string    `json:"nim"`
	IsGraduated bool      `json:"is_graduated"`
	BatchYear   int       `json:"year"`

	Faculty      FacultyResponse      `json:"faculty"`
	StudyProgram StudyProgramResponse `json:"study_program"`
}
