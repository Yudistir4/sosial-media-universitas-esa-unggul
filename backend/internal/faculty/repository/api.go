package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type FacultyRepository interface {
	CreateFaculty(name string, tx *gorm.DB) (dto.Faculty, error)
	GetFacultyByID(ID uuid.UUID) (dto.Faculty, error)
	UpdateFaculty(req *dto.UpdateUserReq, tx *gorm.DB) error
	DeleteFacultyByID(ID uuid.UUID, tx *gorm.DB) error
}
