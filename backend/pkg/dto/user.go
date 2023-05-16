package dto

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID            uuid.UUID `gorm:"type:char(36);primary_key"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	Name          string `json:"name"`
	ProfilePicURL string `json:"profile_pic_url"`
	Email         string `json:"email" validate:"required,unique"`
	Password      string `json:"password" validate:"required"`
	Bio           string
	EksternalLink string
	Instagram     string
	Linkedin      string
	Whatsapp      string

	StudentID    uuid.UUID
	Student      Student `gorm:"ForeignKey:StudentID"`
	UserTypeName string
	UserType     UserType `gorm:"ForeignKey:UserTypeName"`
}

type CreateUserReq struct {
	Name          string `json:"name"`
	ProfilePicURL string `json:"profile_pic_url"`
	Email         string `json:"email"`

	UserType       string `json:"user_type"`
	NIM            string `json:"nim"`
	Angkatan       int    `json:"angkatan"`
	NIDN           int    `json:"nidn"`
	FacultyID      string `json:"faculty_id"`
	StudyProgramID string `json:"study_program_id"`
}

// type CreateUserRes struct {
// 	ID            string
// 	Name          string `json:"name"`
// 	ProfilePicURL string `json:"profile_pic_url"`
// 	Email         string `json:"email"`
// 	Password      string `json:"password"`
// }
