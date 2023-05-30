package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *userRepository) CreateUserFaculty(req dto.CreateUserReq, customID uuid.UUID, tx *gorm.DB) (dto.User, error) {

	user := dto.User{
		ID:           customID,
		Name:         req.Name,
		Email:        req.Email,
		Password:     req.Password,
		UserTypeName: req.UserType,
	}
	result := tx.Create(&user)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Create User Faculty Error:", result.Error)
		return dto.User{}, customerrors.GetErrorType(result.Error)
	}
	return user, nil
}
