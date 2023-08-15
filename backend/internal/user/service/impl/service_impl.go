package impl

import (
	"backend/config"
	repoComment "backend/internal/comment/repository"
	repoConversation "backend/internal/conversation/repository"
	repoFaculty "backend/internal/faculty/repository"
	repoLecturer "backend/internal/lecturer/repository"
	repoLike "backend/internal/like/repository"
	repoMessage "backend/internal/message/repository"
	repoNotification "backend/internal/notification/repository"
	repoOption "backend/internal/option/repository"
	repoPolling "backend/internal/polling/repository"
	repoPost "backend/internal/post/repository"
	repoSave "backend/internal/save/repository"
	repoStudent "backend/internal/student/repository"
	repoVoter "backend/internal/voter/repository"

	repoStudyProgram "backend/internal/studyprogram/repository"
	"backend/internal/user/repository"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/go-redis/redis/v8"
	"github.com/mailgun/mailgun-go/v4"
	"github.com/sirupsen/logrus"
	"gopkg.in/gomail.v2"
	"gorm.io/gorm"
)

type userService struct {
	repo             repository.UserRepository
	repoFaculty      repoFaculty.FacultyRepository
	repoStudent      repoStudent.StudentRepository
	repoLecturer     repoLecturer.LecturerRepository
	repoPost         repoPost.PostRepository
	repoPolling      repoPolling.PollingRepository
	repoLike         repoLike.LikeRepository
	repoComment      repoComment.CommentRepository
	repoSave         repoSave.SaveRepository
	repoNotification repoNotification.NotificationRepository
	repoVoter        repoVoter.VoterRepository
	repoOption       repoOption.OptionRepository
	repoConversation repoConversation.ConversationRepository
	repoMessage      repoMessage.MessageRepository

	repoStudyProgram repoStudyProgram.StudyProgramRepository
	log              *logrus.Entry
	redis            *redis.Client
	mailgun          *mailgun.MailgunImpl
	gmail            *gomail.Dialer
	config           *config.Config
	claudinary       *cloudinary.Cloudinary
	db               *gorm.DB
}
type UserServiceParams struct {
	Repo             repository.UserRepository
	RepoFaculty      repoFaculty.FacultyRepository
	RepoStudent      repoStudent.StudentRepository
	RepoLecturer     repoLecturer.LecturerRepository
	RepoPost         repoPost.PostRepository
	RepoPolling      repoPolling.PollingRepository
	RepoLike         repoLike.LikeRepository
	RepoComment      repoComment.CommentRepository
	RepoSave         repoSave.SaveRepository
	RepoNotification repoNotification.NotificationRepository
	RepoVoter        repoVoter.VoterRepository
	RepoOption       repoOption.OptionRepository
	RepoConversation repoConversation.ConversationRepository
	RepoMessage      repoMessage.MessageRepository
	RepoStudyProgram repoStudyProgram.StudyProgramRepository
	Log              *logrus.Entry
	Redis            *redis.Client
	Mailgun          *mailgun.MailgunImpl
	Gmail            *gomail.Dialer
	Config           *config.Config
	Claudinary       *cloudinary.Cloudinary
	DB               *gorm.DB
}

func NewUserService(params *UserServiceParams) *userService {
	return &userService{
		repo:             params.Repo,
		repoFaculty:      params.RepoFaculty,
		repoStudent:      params.RepoStudent,
		repoLecturer:     params.RepoLecturer,
		repoPost:         params.RepoPost,
		repoPolling:      params.RepoPolling,
		repoLike:         params.RepoLike,
		repoComment:      params.RepoComment,
		repoSave:         params.RepoSave,
		repoNotification: params.RepoNotification,
		repoVoter:        params.RepoVoter,
		repoOption:       params.RepoOption,
		repoConversation: params.RepoConversation,
		repoMessage:      params.RepoMessage,
		repoStudyProgram: params.RepoStudyProgram,
		log:              params.Log,
		redis:            params.Redis,
		mailgun:          params.Mailgun,
		config:           params.Config,
		claudinary:       params.Claudinary,
		db:               params.DB,
		gmail:            params.Gmail,
	}
}
