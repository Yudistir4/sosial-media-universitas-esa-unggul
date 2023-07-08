package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRepository interface {
	GetUsers(req dto.GetUsersReq) ([]dto.User, error)
	GetUserByID(ID uuid.UUID) (dto.User, error)
	GetUserByName(Name string, UserType string) (dto.User, error)
	CreateUserFaculty(req dto.CreateUserReq, CustomID uuid.UUID, tx *gorm.DB) (dto.User, error)
	CreateUserStudent(req dto.CreateUserReq, studentID uuid.UUID, tx *gorm.DB) (dto.User, error)
	CreateUserLecturer(req dto.CreateUserReq, lecturerID uuid.UUID, tx *gorm.DB) (dto.User, error)
	CreateUserUniversity(req dto.CreateUserReq, tx *gorm.DB) (dto.User, error)
	CreateUserOrganization(req dto.CreateUserReq, tx *gorm.DB) (dto.User, error)
	UpdateUser(user *dto.User, tx *gorm.DB) error
	UpdateUserProfile(req *dto.UpdateUserProfileReq) (dto.User, error)
	UpdateUserProfilePic(user *dto.User) error
	DeleteUser(user *dto.User, tx *gorm.DB) error
}
