package impl

import (
	"backend/config"
	"backend/internal/studyprogram/repository"
	repoUser "backend/internal/user/repository"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/sirupsen/logrus"
)

type studyProgramService struct {
	repo       repository.StudyProgramRepository
	repoUser   repoUser.UserRepository
	log        *logrus.Entry
	config     *config.Config
	claudinary *cloudinary.Cloudinary
}
type StudyProgramServiceParams struct {
	Repo       repository.StudyProgramRepository
	RepoUser   repoUser.UserRepository
	Log        *logrus.Entry
	Config     *config.Config
	Claudinary *cloudinary.Cloudinary
}

func NewStudyProgramService(params *StudyProgramServiceParams) *studyProgramService {
	return &studyProgramService{
		repo:       params.Repo,
		repoUser:   params.RepoUser,
		log:        params.Log,
		config:     params.Config,
		claudinary: params.Claudinary,
	}
}
