package config

import (
	"backend/pkg/dto"
	"backend/pkg/utils/passwordutils"
	"fmt"
	"log"
	"strconv"

	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Database struct {
	Username                     string `validate:"required"`
	Password                     string `validate:"required"`
	Hostname                     string `validate:"required"`
	Port                         string `validate:"required"`
	DatabaseName                 string `validate:"required"`
	RelationalDatabaseDriverName string `validate:"required"`
}

var db *gorm.DB

func initDatabase(params *Database) error {
	port, err := strconv.Atoi(params.Port)
	if err != nil {
		return err
	}

	if params.RelationalDatabaseDriverName == "mysql" {
		dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local", params.Username, params.Password, params.Hostname, port, params.DatabaseName)
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	} else if params.RelationalDatabaseDriverName == "postgres" {
		dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=require", params.Hostname, params.Username, params.Password, params.DatabaseName, port)
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	}
	if err != nil {
		return err
	}
	db = db.Debug()

	db.AutoMigrate(&dto.Batch{}, &dto.Faculty{}, &dto.StudyProgram{}, &dto.Student{}, &dto.Lecturer{}, &dto.UserType{}, &dto.User{}, &dto.Post{}, &dto.Like{}, &dto.Save{}, &dto.Comment{}, &dto.Notification{}, &dto.Polling{}, &dto.Option{}, &dto.Voter{})

	err = InitDefaultData(db)
	if err != nil {
		log.Println("[ERROR] Failed Init Default Data")
		return err
	}
	log.Println("[INFO] Successfully establishing database connection")
	return nil
}

func GetDatabaseConn(params *Database) (*gorm.DB, error) {
	var err error
	if db == nil {
		err = initDatabase(params)
		if err != nil {
			log.Println("[ERROR] While get database connection, init database:", err.Error())
		}
	}

	return db, nil
}

func InitDefaultData(db *gorm.DB) error {
	// ADD userTypes
	var count int64
	db.Model(&dto.UserType{}).Count(&count)
	if count == 0 {
		userTypes := []dto.UserType{{Name: "student"}, {Name: "lecturer"}, {Name: "faculty"}, {Name: "university"}, {Name: "organization"}}
		result := db.Create(&userTypes)
		if result.Error != nil {
			fmt.Println("[Error] add userTypes:", result.Error)
		}
		fmt.Println("Success Add UserTypes")
	}

	// Check dulu
	email := "esaunggul@mail.com"
	var user dto.User
	db.Where("email = ?", email).First(&user)
	if user.ID != uuid.Nil {
		return nil
	}
	// ADD Default User
	user = dto.User{
		ID:           uuid.New(),
		Name:         "Universitas Esa Unggul",
		Email:        email,
		Password:     passwordutils.HashPassword("123456"),
		UserTypeName: "university",
	}
	result := db.Create(&user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
