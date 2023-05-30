package repository

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

type AuthRepository interface {
	GetUserByEmail(email string) (dto.User, error)
	Login(req dto.LoginReq) (dto.User, error)
	UpdateUser(user *dto.User) error
	GetUserByID(ID uuid.UUID) (dto.User, error)
}
