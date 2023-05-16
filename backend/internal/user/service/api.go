package service

import "backend/pkg/dto"

type UserService interface {
	GetUsers() (*[]dto.User, error)
	CreateUser(req dto.CreateUserReq) (dto.User, error)
}
