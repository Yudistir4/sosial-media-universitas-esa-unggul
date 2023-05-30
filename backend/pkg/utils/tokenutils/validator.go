package tokenutils

import (
	"backend/config"
	customerrors "backend/pkg/errors"
	"fmt"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

func ValidateToken(SecretKey string, accessToken string, tokenType string) (Payload, error) {

	keyFunc := func(token *jwt.Token) (interface{}, error) {
		// Memastikan bahwa algoritma tanda tangan token adalah HMAC dan menggunakan secretKey yang sama
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(SecretKey), nil
	}

	// Memeriksa dan memvalidasi access token menggunakan secretKey
	token, err := jwt.Parse(accessToken, keyFunc)

	if err != nil {
		if err.Error() == "Token is expired" {
			if tokenType == "accessToken" {
				return Payload{}, customerrors.ErrAccessTokenExpired
			} else if tokenType == "refreshToken" {
				return Payload{}, customerrors.ErrRefreshTokenExpired
			}
		} else if !token.Valid {
			return Payload{}, customerrors.ErrInvalidAccessToken
		}
		return Payload{}, err
	}

	mapClaims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return Payload{}, customerrors.ErrUnauthorized
	}
	userID, err := uuid.Parse(mapClaims["user_id"].(string))
	if err != nil {
		return Payload{}, err
	}
	payload := Payload{
		UserID:   userID,
		UserType: mapClaims["user_type"].(string),
	}

	return payload, nil
}
func ValidateAccessToken(conf *config.JWTConfig, accessToken string) (Payload, error) {
	return ValidateToken(conf.AccessSecretKey, accessToken, "accessToken")
}
func ValidateRefreshToken(conf *config.JWTConfig, refreshToken string) (Payload, error) {
	return ValidateToken(conf.RefreshSecretKey, refreshToken, "refreshToken")
}
