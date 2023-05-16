package impl

import "backend/pkg/dto"

func (s *userService) CreateUser(req dto.CreateUserReq) (dto.User, error) {

	return s.repo.CreateUser(req)
}
