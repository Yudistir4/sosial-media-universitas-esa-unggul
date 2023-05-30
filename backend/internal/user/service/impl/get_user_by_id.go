package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (s *userService) GetUserByID(ID uuid.UUID) (dto.UserResponse, error) {
	user, err := s.repo.GetUserByID(ID)
	if err != nil {
		return dto.UserResponse{}, err
	}
	return dto.ConvertUserToUserResponse(user), nil

}
