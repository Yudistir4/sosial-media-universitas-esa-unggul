package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type StudentRepository interface {
	CreateStudent(req dto.CreateUserReq, tx *gorm.DB) (dto.Student, error)
	GetStudents() (*[]dto.Student, error)
	GetStudentByID(ID uuid.UUID) (dto.Student, error)
	UpdateStudent(req *dto.UpdateUserReq, tx *gorm.DB) error
	DeleteStudentByID(ID uuid.UUID, tx *gorm.DB) error
}
