package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *userRepository) CreateUserLecturer(req dto.CreateUserReq, lecturerID uuid.UUID, tx *gorm.DB) (dto.User, error) {
	if tx == nil {
		return dto.User{}, errors.New("transaction not started")
	}
	user := dto.User{
		ID:           lecturerID,
		Name:         req.Name,
		Email:        req.Email,
		Password:     req.Password,
		UserTypeName: req.UserType,
		LecturerID:   &lecturerID,
	}
	result := tx.Create(&user)

	if result.Error != nil {
		r.log.Errorln("[ERROR] Create User Student Error:", result.Error)
		return dto.User{}, customerrors.GetErrorType(result.Error)
	}

	return user, nil
}
