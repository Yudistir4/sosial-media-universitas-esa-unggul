package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type LecturerRepository interface {
	CreateLecturer(req dto.CreateUserReq, tx *gorm.DB) (dto.Lecturer, error)
	GetLecturers() (*[]dto.Lecturer, error)
	GetLecturerByID(ID uuid.UUID) (dto.Lecturer, error)
	UpdateLecturer(req *dto.UpdateUserReq, tx *gorm.DB) error
	DeleteLecturerByID(ID uuid.UUID, tx *gorm.DB) error

}
