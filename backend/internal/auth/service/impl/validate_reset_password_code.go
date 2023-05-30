package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/redisutils"
)

func (s *authService) ValidateResetPasswordCode(req dto.ValidateResetPasswordCodeReq) error {

	_, err := s.repo.GetUserByEmail(req.Email)
	if err != nil {
		return err
	}
	code, err := redisutils.GetResetPasswordCode(s.redis, req.Email)
	if err != nil {
		s.log.Warningln("[ERROR] while get value from redis:", err.Error())
		return err
	}

	if code != req.Code {
		return customerrors.ErrInvalidResetPasswordCode
	}

	return nil
}
