package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *userRepository) CreateUserOrganization(req dto.CreateUserReq, tx *gorm.DB) (dto.User, error) {

	user := dto.User{
		ID:           uuid.New(),
		Name:         req.Name,
		Email:        req.Email,
		Password:     req.Password,
		UserTypeName: req.UserType,
	}
	result := tx.Create(&user)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Create User Organization Error:", result.Error)
		return dto.User{}, customerrors.GetErrorType(result.Error)
	}

	return user, nil
}
