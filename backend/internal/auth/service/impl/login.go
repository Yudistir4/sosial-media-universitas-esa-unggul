package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/passwordutils"
	"backend/pkg/utils/tokenutils"
)

func (s *authService) Login(req dto.LoginReq) (dto.LoginRes, error) {
	req.Password = passwordutils.HashPassword(req.Password)
	user, err := s.repo.GetUserByEmail(req.Email)
	if err != nil {
		return dto.LoginRes{}, err
	}

	if user.Password != req.Password {
		return dto.LoginRes{}, customerrors.ErrEmailPasswordIncorrect
	}

	var loginRes dto.LoginRes
	loginRes.User = dto.ConvertUserToUserResponse(user)

	loginRes.AccessToken, err = tokenutils.GetAccessToken(tokenutils.Payload{UserID: user.ID, UserType: user.UserTypeName}, &s.config.JWTConfig)
	if err != nil {
		s.log.Warningln("[Login] Error while creating access token", err.Error())
		return dto.LoginRes{}, err
	}

	refreshToken, err := tokenutils.GetRefreshToken(tokenutils.Payload{UserID: user.ID, UserType: user.UserTypeName}, &s.config.JWTConfig)
	if err != nil {
		s.log.Warningln("[Login] Error while inserting refresh token", err.Error())
		return dto.LoginRes{}, err
	}

	loginRes.RefreshToken = refreshToken

	return loginRes, nil
}
