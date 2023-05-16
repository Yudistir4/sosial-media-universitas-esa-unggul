package repository

import "backend/pkg/dto"

type UserRepository interface {
	GetUsers() (*[]dto.User, error)
	CreateUser(req dto.CreateUserReq) (dto.User, error)
}
