package impl

import "backend/pkg/dto"

func (s *userService) GetUsers(req dto.GetUsersReq) (*[]dto.UserResponse, error) {
	users, err := s.repo.GetUsers(req)
	if err != nil {
		return nil, err
	}
	var usersResponse []dto.UserResponse
	for i := 0; i < len(users); i++ {
		usersResponse = append(usersResponse, dto.ConvertUserToUserResponse(users[i]))
	}
	return &usersResponse, nil
}
