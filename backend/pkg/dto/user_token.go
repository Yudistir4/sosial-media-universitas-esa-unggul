package dto

import (
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

type UserContext struct {
	ID uuid.UUID
}
type UserClaims struct {
	jwt.StandardClaims
	UserContext
}

func NewUserClaims(user *UserContext) *UserClaims {
	return &UserClaims{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(2 * time.Hour).Unix(),
		},
		UserContext: UserContext{
			ID: user.ID,
		},
	}
}
