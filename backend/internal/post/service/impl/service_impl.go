package impl

import (
	"backend/config"
	"backend/internal/post/repository"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type postService struct {
	repo       repository.PostRepository
	log        *logrus.Entry
	config     *config.Config
	claudinary *cloudinary.Cloudinary
	db         *gorm.DB
}
type PostServiceParams struct {
	Repo       repository.PostRepository
	Log        *logrus.Entry
	Config     *config.Config
	Claudinary *cloudinary.Cloudinary
	DB         *gorm.DB
}

func NewPostService(params *PostServiceParams) *postService {
	return &postService{
		repo:       params.Repo,
		log:        params.Log,
		config:     params.Config,
		claudinary: params.Claudinary,
		db:         params.DB,
	}
}
