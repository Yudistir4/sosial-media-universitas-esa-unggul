package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
)

func (r *userRepository) UpdateUserProfilePic(user *dto.User) error {

	result := r.db.Save(user)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Update User Profile Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}
	return nil
}
