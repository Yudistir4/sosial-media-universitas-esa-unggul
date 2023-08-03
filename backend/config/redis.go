package config

import (
	"context"
	"crypto/tls"
	"log"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
)

type RedisConfig struct {
	Address  string `validate:"required"`
	Username string
	Password string
}

func InitRedis(param *RedisConfig) (client *redis.Client, err error) {
	for i := 0; i < 10; i++ {
		if os.Getenv("APP_ENVIRONMENT") == "dev" {
			client = redis.NewClient(&redis.Options{
				Addr:     param.Address,
				Username: param.Username,
				Password: param.Password,
			})
		} else {

			client = redis.NewClient(&redis.Options{
				Addr:     param.Address,
				Username: param.Username,
				Password: param.Password,
				TLSConfig: &tls.Config{
					InsecureSkipVerify: true, // Skip TLS verification (only for development/testing)
				},
			})

		}
		_, err = client.Ping(context.Background()).Result()
		if err == nil {
			log.Println("[InitRedis] Init redis successfully")
			break
		}
		log.Printf("[InitRedis] error init redis: %+v, retrying in 1 second\n", err)
		time.Sleep(time.Duration(time.Second))
	}
	return
}
