package webservice

import (
	authrouter "backend/cmd/webservice/auth/router"
	pingrouter "backend/cmd/webservice/ping/router"
	userrouter "backend/cmd/webservice/user/router"
	"backend/config"

	conversationrouter "backend/cmd/webservice/conversation/router"
	notificationrouter "backend/cmd/webservice/notification/router"
	pollingrouter "backend/cmd/webservice/polling/router"
	postrouter "backend/cmd/webservice/post/router"
	studyprogramrouter "backend/cmd/webservice/studyprogram/router"
	authrepository "backend/internal/auth/repository/impl"
	commentrepository "backend/internal/comment/repository/impl"
	conversationrepository "backend/internal/conversation/repository/impl"
	lecturerrepository "backend/internal/lecturer/repository/impl"
	likerepository "backend/internal/like/repository/impl"
	messagerepository "backend/internal/message/repository/impl"
	notificationrepository "backend/internal/notification/repository/impl"
	optionrepository "backend/internal/option/repository/impl"
	pollingrepository "backend/internal/polling/repository/impl"
	pollingservice "backend/internal/polling/service/impl"
	postrepository "backend/internal/post/repository/impl"
	saverepository "backend/internal/save/repository/impl"
	studentrepository "backend/internal/student/repository/impl"
	studyprogramrepository "backend/internal/studyprogram/repository/impl"
	studyprogramservice "backend/internal/studyprogram/service/impl"
	voterrepository "backend/internal/voter/repository/impl"

	authservice "backend/internal/auth/service/impl"
	notificationservice "backend/internal/notification/service/impl"

	conversationservice "backend/internal/conversation/service/impl"
	facultyrepository "backend/internal/faculty/repository/impl"
	pingservice "backend/internal/ping/service/impl"
	postservice "backend/internal/post/service/impl"
	userrepository "backend/internal/user/repository/impl"
	userservice "backend/internal/user/service/impl"
	customservicemiddleware "backend/pkg/middleware/service/impl"
	"backend/pkg/utils/validatorutils"
	"context"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/sirupsen/logrus"
)

type WebserviceParams struct {
	Config *config.Config
	Log    *logrus.Logger
}

func InitWebservice(params *WebserviceParams) error {
	// DB connection
	db, err := config.GetDatabaseConn(&params.Config.Database)
	if err != nil {
		params.Log.Infoln("[ERROR] while get database connection:", err.Error())
		return err
	}

	whiteListAllowOrigin := strings.Split(params.Config.Server.WhiteListAllowOrigin, ",")

	// Echo Web Server
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     whiteListAllowOrigin,
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowCredentials: true,
	}))

	defer func() error {
		err := e.Shutdown(context.Background())
		if err != nil {
			params.Log.Infoln("[ERROR] while shutdown echo web server:", err.Error())
			return err
		}

		params.Log.Infoln("[INFO] Echo web server shutdown gracefully")
		return nil
	}()

	// Redis
	redis, err := config.InitRedis(&params.Config.RedisConfig)
	if err != nil {
		params.Log.Warningln("[ERROR] while creating redis client:", err.Error())
		return err
	}
	defer func() error {
		err := redis.Close()
		if err != nil {
			params.Log.Infoln("[ERROR] while close redis:", err.Error())
			return err
		}

		params.Log.Infoln("[INFO] Redis closed gracefully")
		return nil
	}()

	validator, err := validatorutils.New()
	if err != nil {
		params.Log.Warningln("[ERROR] while creating the validator:", err.Error())
		return err
	}
	mailgunClient := config.InitMailgun(&params.Config.Mailgun)
	gmailClient := config.InitGmail(&params.Config.Gmail)

	cloudinary, err := config.GetCloudinaryConn(&params.Config.Cloudinary)
	if err != nil {
		params.Log.Warningln("[ERROR] while creating the cloudinary client:", err.Error())
		return err
	}
	// Middleware
	middleware := customservicemiddleware.NewServiceMiddleware(&customservicemiddleware.MiddlewareParams{
		Config: params.Config,
		Redis:  redis,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "middleware",
			"layer":  "service",
		}),
	})

	// Auth
	authRepository := authrepository.NewAuthRepository(&authrepository.AuthRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "auth",
			"layer":  "repository",
		}),
	})

	authService := authservice.NewAuthService(&authservice.AuthServiceParams{
		Repo: authRepository,

		Redis: redis,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "auth",
			"layer":  "service",
		}),
		Mailgun: mailgunClient,
		Gmail:   gmailClient,
		Config:  params.Config,
		// Claudinary: cloudinary,
		// DB:         db,
	})
	authrouter.InitAuthRouter(authrouter.RouterParams{
		E:         e,
		Service:   authService,
		Validator: validator,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "auth",
			"layer":  "handler",
		}),
		Middleware: middleware,
	})

	// Ping
	pingService := pingservice.NewPingService(pingservice.Service{})
	pingrouter.InitPingRouter(pingrouter.RouterParams{
		E:           e,
		PingService: pingService,
	})

	// Faculty
	facultyRepository := facultyrepository.NewFacultyRepository(&facultyrepository.FacultyRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "faculty",
			"layer":  "repository",
		}),
	})

	// Student
	studentRepository := studentrepository.NewStudentRepository(&studentrepository.StudentRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "student",
			"layer":  "repository",
		}),
	})
	// Lecturer
	lecturerRepository := lecturerrepository.NewLecturerRepository(&lecturerrepository.LecturerRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "lecturer",
			"layer":  "repository",
		}),
	})

	// Comment
	commentRepository := commentrepository.NewCommentRepository(&commentrepository.CommentRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "comment",
			"layer":  "repository",
		}),
	})
	// Save
	saveRepository := saverepository.NewSaveRepository(&saverepository.SaveRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "save",
			"layer":  "repository",
		}),
	})
	// Like
	likeRepository := likerepository.NewLikeRepository(&likerepository.LikeRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "like",
			"layer":  "repository",
		}),
	})

	// Notification
	notificationRepository := notificationrepository.NewNotificationRepository(&notificationrepository.NotificationRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "notification",
			"layer":  "repository",
		}),
	})

	notificationService := notificationservice.NewNotificationService(&notificationservice.NotificationServiceParams{
		Repo: notificationRepository,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "notification",
			"layer":  "service",
		}),
		Config: params.Config,
	})
	notificationrouter.InitNotificationRouter(notificationrouter.RouterParams{
		E:         e,
		Service:   notificationService,
		Validator: validator,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "notification",
			"layer":  "handler",
		}),
		Middleware: middleware,
	})
	// Post
	postRepository := postrepository.NewPostRepository(&postrepository.PostRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "post",
			"layer":  "repository",
		}),
	})

	postService := postservice.NewPostService(&postservice.PostServiceParams{
		Repo:             postRepository,
		RepoLike:         likeRepository,
		RepoSave:         saveRepository,
		RepoComment:      commentRepository,
		RepoNotification: notificationRepository,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "post",
			"layer":  "service",
		}),
		Config:     params.Config,
		Claudinary: cloudinary,
		DB:         db,
	})
	postrouter.InitPostRouter(postrouter.RouterParams{
		E:         e,
		Service:   postService,
		Validator: validator,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "post",
			"layer":  "handler",
		}),
		Middleware: middleware,
	})
	// Voter
	voterRepository := voterrepository.NewVoterRepository(&voterrepository.VoterRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "voter",
			"layer":  "repository",
		}),
	})
	// Option
	optionRepository := optionrepository.NewOptionRepository(&optionrepository.OptionRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "option",
			"layer":  "repository",
		}),
	})
	// Polling
	pollingRepository := pollingrepository.NewPollingRepository(&pollingrepository.PollingRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "polling",
			"layer":  "repository",
		}),
	})

	pollingService := pollingservice.NewPollingService(&pollingservice.PollingServiceParams{
		Repo:             pollingRepository,
		RepoOption:       optionRepository,
		RepoVoter:        voterRepository,
		RepoNotification: notificationRepository,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "polling",
			"layer":  "service",
		}),
		Config:     params.Config,
		Claudinary: cloudinary,
		DB:         db,
	})
	pollingrouter.InitPollingRouter(pollingrouter.RouterParams{
		E:         e,
		Service:   pollingService,
		Validator: validator,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "polling",
			"layer":  "handler",
		}),
		Middleware: middleware,
	})
	// Message
	messageRepository := messagerepository.NewMessageRepository(&messagerepository.MessageRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "message",
			"layer":  "repository",
		}),
	})
	// Conversation
	conversationRepository := conversationrepository.NewConversationRepository(&conversationrepository.ConversationRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "conversation",
			"layer":  "repository",
		}),
	})

	conversationService := conversationservice.NewConversationService(&conversationservice.ConversationServiceParams{
		Repo:        conversationRepository,
		RepoMessage: messageRepository,
		// RepoOption:       optionRepository,
		// RepoVoter:        voterRepository,
		// RepoNotification: notificationRepository,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "conversation",
			"layer":  "service",
		}),
		Config:     params.Config,
		Claudinary: cloudinary,
		DB:         db,
	})
	conversationrouter.InitConversationRouter(conversationrouter.RouterParams{
		E:         e,
		Service:   conversationService,
		Validator: validator,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "conversation",
			"layer":  "handler",
		}),
		Middleware: middleware,
	})

	// StudyProgramRepository
	studyProgramRepository := studyprogramrepository.NewStudyProgramRepository(&studyprogramrepository.StudyProgramRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "studyProgram",
			"layer":  "repository",
		}),
	})

	// User
	userRepository := userrepository.NewUserRepository(&userrepository.UserRepositoryParams{
		DB: db,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "user",
			"layer":  "repository",
		}),
	})

	userService := userservice.NewUserService(&userservice.UserServiceParams{
		Repo:             userRepository,
		RepoFaculty:      facultyRepository,
		RepoStudent:      studentRepository,
		RepoLecturer:     lecturerRepository,
		RepoPost:         postRepository,
		RepoPolling:      pollingRepository,
		RepoLike:         likeRepository,
		RepoComment:      commentRepository,
		RepoSave:         saveRepository,
		RepoNotification: notificationRepository,
		RepoVoter:        voterRepository,
		RepoOption:       optionRepository,
		RepoStudyProgram: studyProgramRepository,
		RepoConversation: conversationRepository,
		RepoMessage:      messageRepository,
		Redis:            redis,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "user",
			"layer":  "service",
		}),
		Mailgun:    mailgunClient,
		Gmail:      gmailClient,
		Config:     params.Config,
		Claudinary: cloudinary,
		DB:         db,
	})
	userrouter.InitUserRouter(userrouter.RouterParams{
		E:         e,
		Service:   userService,
		Validator: validator,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "user",
			"layer":  "handler",
		}),
		Middleware: middleware,
	})
	// Studyprogram Service and router

	studyProgramService := studyprogramservice.NewStudyProgramService(&studyprogramservice.StudyProgramServiceParams{
		Repo:     studyProgramRepository,
		Config:   params.Config,
		RepoUser: userRepository,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "studyProgram",
			"layer":  "service",
		}),
		Claudinary: cloudinary,
	})

	studyprogramrouter.InitStudyProgramRouter(studyprogramrouter.RouterParams{
		E:         e,
		Service:   studyProgramService,
		Validator: validator,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "studyProgram",
			"layer":  "handler",
		}),
		Middleware: middleware,
	})

	// Server
	err = config.StartServer(&config.Server{
		E:    e,
		Port: params.Config.Server.Port,
	})
	if err != nil {
		params.Log.Warningln("[ERROR] while starting the server:", err.Error())
		return err
	}
	return nil

}
