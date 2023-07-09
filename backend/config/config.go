package config

import (
	"backend/pkg/utils/validatorutils"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Database
	JWTConfig
	Server
	Cloudinary
	RedisConfig
	Mailgun
	Gmail
	// CustomerToken
	FrontEndURL              string `validate:"required,url"`
	DefaultProfilePictureURL string `validate:"required,url"`
}

var config *Config

func initConfig(path string) error {
	err := godotenv.Load(path)
	if err != nil {
		log.Println("[INFO] The .env file doesn't exist")
		log.Println("[INFO] Program will load environment variable value")
	}
	expiredAccessSecretKey, err := strconv.Atoi(os.Getenv("EXPIRED_ACCESS_SECRET_KEY"))
	if err != nil {
		log.Println("[ERROR] While convert Expired Secret Key ")
		return err
	}
	expiredRefreshSecretKey, err := strconv.Atoi(os.Getenv("EXPIRED_REFRESH_SECRET_KEY"))
	if err != nil {
		log.Println("[ERROR] While convert Expired Secret Key ")
		return err
	}
	smtpPort, err := strconv.Atoi(os.Getenv("GMAIL_SMTP_PORT"))
	if err != nil {
		log.Println("[ERROR] While convert smtp port ")
		return err
	}

	config = &Config{
		Gmail: Gmail{
			GmailAuthPassword: os.Getenv("GMAIL_AUTH_PASSWORD"),
			SenderEmail:       os.Getenv("GMAIL_SENDER_EMAIL"),
			SMTPHost:          os.Getenv("GMAIL_SMTP_HOST"),
			SMTPPort:          smtpPort,
		},
		Database: Database{
			Username:                     os.Getenv("DB_USERNAME"),
			Password:                     os.Getenv("DB_PASSWORD"),
			Hostname:                     os.Getenv("DB_HOSTNAME"),
			Port:                         os.Getenv("DB_PORT"),
			DatabaseName:                 os.Getenv("DB_NAME"),
			RelationalDatabaseDriverName: os.Getenv("DB_DRIVER_NAME"),
		},
		JWTConfig: JWTConfig{
			AccessSecretKey:         os.Getenv("ACCESS_SECRET_KEY"),
			RefreshSecretKey:        os.Getenv("REFRESH_SECRET_KEY"),
			ExpiredAccessSecretKey:  expiredAccessSecretKey,
			ExpiredRefreshSecretKey: expiredRefreshSecretKey,
		},
		Server: Server{
			Port:                 os.Getenv("APP_PORT"),
			Environment:          os.Getenv("APP_ENVIRONMENT"),
			WhiteListAllowOrigin: os.Getenv("WHITELIST_ALLOW_ORIGIN"),
		},
		Cloudinary: Cloudinary{
			APIKey:    os.Getenv("API_KEY"),
			APISecret: os.Getenv("API_SECRET"),
			CloudName: os.Getenv("CLOUD_NAME"),
		},
		RedisConfig: RedisConfig{
			Address:  os.Getenv("REDIS_ADDRESS"),
			Username: os.Getenv("REDIS_USERNAME"),
			Password: os.Getenv("REDIS_PASSWORD"),
		},
		Mailgun: Mailgun{
			PrivateApiKey: os.Getenv("MAILGUN_API_KEY"),
			PublicApiKey:  os.Getenv("MAILGUN_PUBLIC_API_KEY"),
			Domain:        os.Getenv("MAILGUN_DOMAIN"),
			SenderEmail:   os.Getenv("MAILGUN_SENDER_EMAIL"),
		},
		FrontEndURL:              os.Getenv("FRONTEND_URL"),
		DefaultProfilePictureURL: os.Getenv("DEFAULT_PROFILE_PICTURE_URL"),
	}

	validator, err := validatorutils.New()
	if err != nil {
		return err
	}

	err = validator.Validate.Struct(config)
	if err != nil {
		return err
	}

	if config.Server.Environment == "prod" && config.Server.WhiteListAllowOrigin == "" {
		return err
	}

	if config.Server.Environment == "dev" {
		config.Server.WhiteListAllowOrigin = "*"
	}
	return nil
}

func GetConfig(path string) (*Config, error) {
	if config == nil {
		err := initConfig(path)
		if err != nil {
			return nil, err
		}
	}
	return config, nil
}
