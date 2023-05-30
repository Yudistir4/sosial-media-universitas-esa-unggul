package impl

import (
	"backend/config"
	repoFaculty "backend/internal/faculty/repository"
	repoLecturer "backend/internal/lecturer/repository"
	repoStudent "backend/internal/student/repository"
	"backend/internal/user/repository"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/go-redis/redis/v8"
	"github.com/mailgun/mailgun-go/v4"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type userService struct {
	repo         repository.UserRepository
	repoFaculty  repoFaculty.FacultyRepository
	repoStudent  repoStudent.StudentRepository
	repoLecturer repoLecturer.LecturerRepository
	log          *logrus.Entry
	redis        *redis.Client
	mailgun      *mailgun.MailgunImpl
	config       *config.Config
	claudinary   *cloudinary.Cloudinary
	db           *gorm.DB
}
type UserServiceParams struct {
	Repo         repository.UserRepository
	RepoFaculty  repoFaculty.FacultyRepository
	RepoStudent  repoStudent.StudentRepository
	RepoLecturer repoLecturer.LecturerRepository
	Log          *logrus.Entry
	Redis        *redis.Client
	Mailgun      *mailgun.MailgunImpl
	Config       *config.Config
	Claudinary   *cloudinary.Cloudinary
	DB           *gorm.DB
}

func NewUserService(params *UserServiceParams) *userService {
	return &userService{
		repo:         params.Repo,
		repoFaculty:  params.RepoFaculty,
		repoStudent:  params.RepoStudent,
		repoLecturer: params.RepoLecturer,
		log:          params.Log,
		redis:        params.Redis,
		mailgun:      params.Mailgun,
		config:       params.Config,
		claudinary:   params.Claudinary,
		db: params.DB,
	}
}
