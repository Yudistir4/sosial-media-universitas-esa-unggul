package impl

import "backend/pkg/dto"

func (r *userRepository) GetUsers() (*[]dto.User, error) {
	var users []dto.User
	r.db.Find(&users)
	return &users, nil
}
