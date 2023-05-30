package impl

import (
	"backend/pkg/dto"
	"backend/pkg/utils/tokenutils"
)

func (s *authService) RefreshToken(req dto.RefreshTokenReq) (dto.RefreshTokenRes, error) {
	user, err := tokenutils.ValidateRefreshToken(&s.config.JWTConfig, req.RefreshToken)
	if err != nil {
		return dto.RefreshTokenRes{}, err
	}
	accessToken, err := tokenutils.GetAccessToken(user, &s.config.JWTConfig)
	if err != nil {
		s.log.Warningln("[ERROR] while get access token:", err)
		return dto.RefreshTokenRes{}, err
	}

	res := dto.RefreshTokenRes{
		AccessToken: accessToken,
		ExpiresIn:   s.config.ExpiredAccessSecretKey * 60,
	}
	return res, nil
}
