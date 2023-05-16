package config

import (
	"backend/pkg/dto"
	"fmt"
	"log"
	"strconv"

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

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local", params.Username, params.Password, params.Hostname, port, params.DatabaseName)
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	db.AutoMigrate(&dto.Faculty{}, &dto.StudyProgram{}, &dto.Student{}, &dto.UserType{}, &dto.User{})

	// ADD userTypes
	var count int64
	db.Model(&dto.UserType{}).Count(&count)
	if count == 0 {
		userTypes := []dto.UserType{{Name: "student"}, {Name: "lecturer"}}
		result := db.Create(&userTypes)
		if result.Error != nil {
			fmt.Println("[Error] add userTypes:", result.Error)
		}
		fmt.Println("Success Add UserTypes")
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
