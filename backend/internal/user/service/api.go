package service

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

type UserService interface {
	SendPasswordToUserEmail(password, email string) error
	GetUsers(req dto.GetUsersReq) (*[]dto.UserResponse, error)
	GetUserByID(ID uuid.UUID) (dto.UserResponse, error)
	CreateUser(req dto.CreateUserReq) (userResponse dto.UserResponse, err error)
	UpdateUser(req dto.UpdateUserReq) (userResponse dto.UserResponse, err error)
	UpdateUserProfile(req dto.UpdateUserProfileReq) (userResponse dto.UserResponse, err error)
	DeleteUser(ID uuid.UUID) (rerr error)
	DeleteUserProfilePic(ID uuid.UUID) error 
	UpdateUserProfilePic(req dto.UpdateProfilePicReq) (res dto.UpdateProfilePicRes,err error)
}
