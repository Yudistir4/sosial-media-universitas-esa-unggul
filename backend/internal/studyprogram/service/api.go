package service

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

type StudyProgramService interface {
	GetStudyPrograms() (*[]dto.StudyProgram, error)
	CreateStudyProgram(req dto.CreateStudyProgramReq) (dto.StudyProgramResponse, error)
	DeleteStudyProgram(ID uuid.UUID) error
}
