package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"errors"

	"gorm.io/gorm"
)

func (r *userRepository) UpdateUser(user *dto.User, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}
	result := tx.Save(&user)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Create User Faculty Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}
	return nil
}
