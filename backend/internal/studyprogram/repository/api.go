package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type StudyProgramRepository interface {
	CreateStudyProgram(dto.CreateStudyProgramReq) (dto.StudyProgram, error)
	GetStudyProgramByID(ID uuid.UUID) (dto.StudyProgram, error)
	GetStudyPrograms(req dto.GetStudyProgramsReq) (*[]dto.StudyProgram, error)
	GetStudyProgramByName(Name string) (dto.StudyProgram, error)
	DeleteStudyProgramByID(ID uuid.UUID) error
	DeleteStudyProgramsRelatedToUser(UserID uuid.UUID, tx *gorm.DB) error
	UpdateStudyProgramName(req dto.UpdateStudyProgramNameReq) (dto.StudyProgram, error)
}
