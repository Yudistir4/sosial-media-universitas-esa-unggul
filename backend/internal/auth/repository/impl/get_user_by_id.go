package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *authRepository) GetUserByID(ID uuid.UUID) (dto.User, error) {
	var user dto.User
	err := r.db.First(&user, ID).Error
	if err != nil {
		return dto.User{}, err
	}

	return user, nil
}
