package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/passwordutils"
	"backend/pkg/utils/redisutils"
)

func (s *authService) ResetPasswordAfterForgot(req dto.ResetPasswordAfterForgotReq) error {

	// get user
	user, err := s.repo.GetUserByEmail(req.Email)
	if err != nil {
		return err
	}

	// get code from redis
	code, err := redisutils.GetResetPasswordCode(s.redis, req.Email)
	if err != nil {
		s.log.Warningln("[ERROR] while get value from redis:", err.Error())
		return err
	}

	user.Password = passwordutils.HashPassword(req.NewPassword)

	if code != req.Code {
		return customerrors.ErrInvalidResetPasswordCode
	}

	// update user
	err = s.repo.UpdateUser(&user)
	if err != nil {
		return err
	}

	// Delete value in redis
	err = s.redis.Del(s.redis.Context(), req.Email).Err()
	if err != nil {
		return err
	}
	return nil
}
