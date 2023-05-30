package tokenutils

import (
	"backend/config"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

type Payload struct {
	UserID   uuid.UUID
	UserType string
}

func getToken(payload Payload, ExpiredTime time.Duration, SecretKey string) (string, error) {
	// Set the expiration time
	expirationTime := time.Now().Add(ExpiredTime * time.Minute)

	// Create the claims for the token
	claims := jwt.MapClaims{
		"user_id":   payload.UserID,
		"user_type": payload.UserType,
		"exp":       expirationTime.Unix(),
	}

	// Create a new token with the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key
	accessToken, err := token.SignedString([]byte(SecretKey))
	if err != nil {
		return "", err
	}

	return accessToken, nil
}

func GetAccessToken(payload Payload, JWTConfig *config.JWTConfig) (string, error) {
	return getToken(payload, time.Duration(JWTConfig.ExpiredAccessSecretKey), JWTConfig.AccessSecretKey)
}

func GetRefreshToken(payload Payload, JWTConfig *config.JWTConfig) (string, error) {
	return getToken(payload, time.Duration(JWTConfig.ExpiredRefreshSecretKey), JWTConfig.RefreshSecretKey)
}
