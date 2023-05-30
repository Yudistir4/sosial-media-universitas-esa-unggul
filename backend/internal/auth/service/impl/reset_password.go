package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/passwordutils"
)

func (s *authService) ResetPassword(req dto.ResetPasswordReq) error {
	// hash old password
	oldPassword := passwordutils.HashPassword(req.OldPassword)
	
	// get user
	user, err := s.repo.GetUserByID(req.ID)
	if err != nil {
		return err
	}

	// check old password if not valid return error
	if user.Password != oldPassword {
		return customerrors.ErrOldPasswordInvalid
	}

	// replace new password
	user.Password = passwordutils.HashPassword(req.NewPassword)

	// update user
	err = s.repo.UpdateUser(&user)
	if err != nil {
		return err
	}

	return nil
}
