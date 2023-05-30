package impl

import (
	"backend/config"
	"backend/internal/studyProgram/repository"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/sirupsen/logrus"
)

type studyProgramService struct {
	repo       repository.StudyProgramRepository
	log        *logrus.Entry
	config     *config.Config
	claudinary *cloudinary.Cloudinary
}
type StudyProgramServiceParams struct {
	Repo       repository.StudyProgramRepository
	Log        *logrus.Entry
	Config     *config.Config
	Claudinary *cloudinary.Cloudinary
}

func NewStudyProgramService(params *StudyProgramServiceParams) *studyProgramService {
	return &studyProgramService{
		repo:       params.Repo,
		log:        params.Log,
		config:     params.Config,
		claudinary: params.Claudinary,
	}
}
