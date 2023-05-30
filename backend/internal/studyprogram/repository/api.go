package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

type StudyProgramRepository interface {
	CreateStudyProgram(dto.CreateStudyProgramReq) (dto.StudyProgram, error)
	GetStudyProgramByID(ID uuid.UUID) (dto.StudyProgram, error)
	GetStudyPrograms() (*[]dto.StudyProgram, error)
	DeleteStudyProgramByID(ID uuid.UUID) error
}
