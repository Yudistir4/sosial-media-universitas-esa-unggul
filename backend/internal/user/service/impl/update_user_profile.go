package impl

import (
	"backend/pkg/dto"
)

func (s *userService) UpdateUserProfile(req dto.UpdateUserProfileReq) (userResponse dto.UserResponse, err error) {
	user, err := s.repo.UpdateUserProfile(&req)
	if err != nil {
		return dto.UserResponse{}, err
	}
	return dto.ConvertUserToUserResponse(user), nil

}
