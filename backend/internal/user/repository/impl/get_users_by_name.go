package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"strings"

	"gorm.io/gorm"
)

func (r *userRepository) GetUserByName(Name string, UserType string) (dto.User, error) {
	var user dto.User
	err := r.db.Where("LOWER(name) = ? AND user_type_name = ?", strings.ToLower(Name), UserType).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return dto.User{}, customerrors.ErrUserNotFound
		}
		return dto.User{}, err
	}

	return user, nil
}
