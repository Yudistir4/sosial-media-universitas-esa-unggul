package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/redisutils"
)

func (s *authService) VerifyEmail(req dto.VerifyEmailReq) error {

	user, err := s.repo.GetUserByID(req.ID)
	if err != nil {
		return err
	}

	key := req.NewEmail + "-change-email"
	code, err := redisutils.GetEmailVerificationCode(s.redis, key)
	if err != nil {
		s.log.Warningln("[ERROR] while get value from redis:", err.Error())
		return err
	}

	if code != req.VerificationCode {
		return customerrors.ErrInvalidVerifyCode
	}

	// Replace and save
	user.Email = req.NewEmail
	s.repo.UpdateUser(&user)

	err = s.redis.Del(s.redis.Context(), key).Err()
	if err != nil {
		return err
	}

	return nil
}
