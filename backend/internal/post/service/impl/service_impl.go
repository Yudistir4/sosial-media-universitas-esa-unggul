package impl

import (
	"backend/config"
	repoLike "backend/internal/like/repository"
	repoSave "backend/internal/save/repository"
	repoComment "backend/internal/comment/repository"
	"backend/internal/post/repository"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type postService struct {
	repo        repository.PostRepository
	repoLike    repoLike.LikeRepository
	repoSave    repoSave.SaveRepository
	repoComment repoComment.CommentRepository
	log         *logrus.Entry
	config      *config.Config
	claudinary  *cloudinary.Cloudinary
	db          *gorm.DB
}
type PostServiceParams struct {
	Repo        repository.PostRepository
	RepoLike    repoLike.LikeRepository
	RepoSave    repoSave.SaveRepository
	RepoComment repoComment.CommentRepository
	Log         *logrus.Entry
	Config      *config.Config
	Claudinary  *cloudinary.Cloudinary
	DB          *gorm.DB
}

func NewPostService(params *PostServiceParams) *postService {
	return &postService{
		repo:        params.Repo,
		log:         params.Log,
		config:      params.Config,
		claudinary:  params.Claudinary,
		db:          params.DB,
		repoLike:    params.RepoLike,
		repoSave:    params.RepoSave,
		repoComment: params.RepoComment,
	}
}
