package redisutils

import (
	customerrors "backend/pkg/errors"
	"time"

	"github.com/go-redis/redis/v8"
)

func GetResetPasswordCode(redis *redis.Client, email string) (string, error) {
	ttl := redis.TTL(redis.Context(), email).Val()
	if ttl == time.Duration(-2) || ttl == time.Duration(-1) {
		return "", customerrors.ErrResetPasswordLinkExpiredOrNotExist
	}
	// get value
	code, err := redis.Get(redis.Context(), email).Result()
	if err != nil {
		return "", err
	}
	return code, nil
}
func GetEmailVerificationCode(redis *redis.Client, key string) (string, error) {
	ttl := redis.TTL(redis.Context(), key).Val()
	if ttl == time.Duration(-2) || ttl == time.Duration(-1) {
		return "", customerrors.ErrEmailVerificationCodeExpiredOrNotExist
	}
	// get value
	code, err := redis.Get(redis.Context(), key).Result()
	if err != nil {
		return "", err
	}
	return code, nil
}
