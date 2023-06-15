package service

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

type StudyProgramService interface {
	GetStudyPrograms(req dto.GetStudyProgramsReq) (*[]dto.StudyProgramResponse, error)
	CreateStudyProgram(req dto.CreateStudyProgramReq) (dto.StudyProgramResponse, error)
	DeleteStudyProgram(ID uuid.UUID) error
}
