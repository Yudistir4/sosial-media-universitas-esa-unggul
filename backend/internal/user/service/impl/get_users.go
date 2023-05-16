package impl

import "backend/pkg/dto"

func (s *userService) GetUsers() (*[]dto.User, error) {
	return s.repo.GetUsers()
}
