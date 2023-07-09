package impl

import (
	"backend/config"
	"backend/internal/auth/repository"

	"github.com/go-redis/redis/v8"
	"github.com/mailgun/mailgun-go/v4"
	"github.com/sirupsen/logrus"
	"gopkg.in/gomail.v2"
)

type authService struct {
	repo    repository.AuthRepository
	log     *logrus.Entry
	redis   *redis.Client
	mailgun *mailgun.MailgunImpl
	config  *config.Config
	gmail   *gomail.Dialer
}

type AuthServiceParams struct {
	Repo    repository.AuthRepository
	Log     *logrus.Entry
	Redis   *redis.Client
	Mailgun *mailgun.MailgunImpl
	Gmail   *gomail.Dialer
	Config  *config.Config
}

func NewAuthService(params *AuthServiceParams) *authService {
	return &authService{
		repo:    params.Repo,
		log:     params.Log,
		redis:   params.Redis,
		mailgun: params.Mailgun,
		config:  params.Config,
		gmail:   params.Gmail,
	}
}
