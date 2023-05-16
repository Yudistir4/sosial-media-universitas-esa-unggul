package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *userRepository) CreateUser(req dto.CreateUserReq) (dto.User, error) {

	user := dto.User{
		ID:       uuid.New(),
		Name:     req.Name,
		Email:    req.Email,
		Password: "123123",
	}
	r.db.Create(&user)
	return user, nil
}
