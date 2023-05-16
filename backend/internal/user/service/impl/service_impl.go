package impl

import (
	"backend/config"
	"backend/internal/user/repository"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/go-redis/redis/v8"
	"github.com/mailgun/mailgun-go/v4"
	"github.com/sirupsen/logrus"
)

type userService struct {
	repo       repository.UserRepository
	log        *logrus.Entry
	redis      *redis.Client
	mailgun    *mailgun.MailgunImpl
	config     *config.Config
	claudinary *cloudinary.Cloudinary
}
type UserServiceParams struct {
	Repo       repository.UserRepository
	Log        *logrus.Entry
	Redis      *redis.Client
	Mailgun    *mailgun.MailgunImpl
	Config     *config.Config
	Claudinary *cloudinary.Cloudinary
}

func NewUserService(params *UserServiceParams) *userService {
	return &userService{
		repo:       params.Repo,
		log:        params.Log,
		redis:      params.Redis,
		mailgun:    params.Mailgun,
		config:     params.Config,
		claudinary: params.Claudinary,
	}
}
