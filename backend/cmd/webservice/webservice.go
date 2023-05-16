package webservice

import (
	pingrouter "backend/cmd/webservice/ping/router"
	userrouter "backend/cmd/webservice/user/router"
	"backend/config"
	pingservice "backend/internal/ping/service/impl"
	userrepository "backend/internal/user/repository/impl"
	userservice "backend/internal/user/service/impl"
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

	cloudinary, err := config.GetCloudinaryConn(&params.Config.Cloudinary)
	if err != nil {
		params.Log.Warningln("[ERROR] while creating the cloudinary client:", err.Error())
		return err
	}

	// Ping
	pingService := pingservice.NewPingService(pingservice.Service{})
	pingrouter.InitPingRouter(pingrouter.RouterParams{
		E:           e,
		PingService: pingService,
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
		Repo:  userRepository,
		Redis: redis,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "user",
			"layer":  "service",
		}),
		Mailgun:    mailgunClient,
		Config:     params.Config,
		Claudinary: cloudinary,
	})
	userrouter.InitUserRouter(userrouter.RouterParams{
		E:         e,
		Service:   userService,
		Validator: validator,
		Log: params.Log.WithFields(logrus.Fields{
			"domain": "user",
			"layer":  "handler",
		}),
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
