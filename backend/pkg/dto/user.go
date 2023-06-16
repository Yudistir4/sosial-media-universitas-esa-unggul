package dto

import (
	"mime/multipart"
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID                 uuid.UUID `gorm:"type:char(36);primary_key"`
	CreatedAt          time.Time
	UpdatedAt          time.Time
	Name               string `json:"name"`
	ProfilePicURL      string `json:"profile_pic_url"`
	ProfilePicPublicID string
	Email              string `json:"email" validate:"required" gorm:"unique"`
	Password           string `json:"password" validate:"required"`
	Bio                string
	EksternalLink      string
	Instagram          string
	Linkedin           string
	Whatsapp           string

	StudentID    *uuid.UUID
	Student      Student `gorm:"ForeignKey:StudentID"`
	LecturerID   *uuid.UUID
	Lecturer     Lecturer `gorm:"ForeignKey:LecturerID"`
	UserTypeName string
	UserType     UserType `gorm:"ForeignKey:UserTypeName"`
}

type CreateUserReq struct {
	Password       string
	Name           string `json:"name" validate:"required"`
	Email          string `json:"email" validate:"required"`
	UserType       string `json:"user_type" validate:"required"`
	NIM            string `json:"nim"`
	Angkatan       int    `json:"angkatan"`
	NIDN           string `json:"nidn"`
	FacultyID      string `json:"faculty_id"`
	StudyProgramID string `json:"study_program_id"`
}
type UpdateUserReq struct {
	ID             uuid.UUID `param:"id" validate:"required"`
	UserType       string    `json:"user_type" validate:"required"`
	Name           string    `json:"name" validate:"required"`
	Email          string    `json:"email" validate:"required"`
	NIM            string    `json:"nim"`
	Angkatan       int       `json:"angkatan"`
	NIDN           string    `json:"nidn"`
	FacultyID      uuid.UUID `json:"faculty_id"`
	StudyProgramID uuid.UUID `json:"study_program_id"`
}
type CreateUserStudentReq struct {
	NIM            string `json:"nim" validate:"required"`
	Angkatan       int    `json:"angkatan" validate:"required"`
	FacultyID      string `json:"faculty_id" validate:"required"`
	StudyProgramID string `json:"study_program_id" validate:"required"`
}
type UpdateUserStudentReq struct {
	NIM            string    `json:"nim" validate:"required"`
	Angkatan       int       `json:"angkatan" validate:"required"`
	FacultyID      uuid.UUID `json:"faculty_id" validate:"required"`
	StudyProgramID uuid.UUID `json:"study_program_id" validate:"required"`
}
type CreateUserLecturerReq struct {
	NIDN           string `json:"nidn" validate:"required"`
	FacultyID      string `json:"faculty_id" validate:"required"`
	StudyProgramID string `json:"study_program_id" validate:"required"`
}
type UpdateUserLecturerReq struct {
	NIDN           string    `json:"nidn" validate:"required"`
	FacultyID      uuid.UUID `json:"faculty_id" validate:"required"`
	StudyProgramID uuid.UUID `json:"study_program_id" validate:"required"`
}

type UserResponse struct {
	ID            uuid.UUID        `json:"id"`
	CreatedAt     time.Time        `json:"created_at"`
	UpdatedAt     time.Time        `json:"updated_at"`
	Name          string           `json:"name"`
	ProfilePicURL string           `json:"profile_pic_url"`
	Email         string           `json:"email"`
	Bio           string           `json:"bio"`
	EksternalLink string           `json:"eksternal_link"`
	Instagram     string           `json:"instagram"`
	Linkedin      string           `json:"linkedin"`
	Whatsapp      string           `json:"whatsapp"`
	Student       StudentResponse  `json:"student"`
	Lecturer      LecturerResponse `json:"lecturer"`
	UserTypeName  string           `json:"user_type"`
}
type UpdateUserProfileReq struct {
	ID            uuid.UUID `param:"id"`
	Bio           string    `json:"bio"`
	EksternalLink string    `json:"eksternal_link"`
	Instagram     string    `json:"instagram"`
	Linkedin      string    `json:"linkedin"`
	Whatsapp      string    `json:"whatsapp"`
}

type UpdateProfilePicReq struct {
	ID            uuid.UUID             `param:"id" validate:"required"`
	ProfilePic    *multipart.FileHeader `validate:"required"`
	ProfilePicSrc string
	ProfilePicURL string
}
type UpdateProfilePicRes struct {
	ProfilePicURL string `json:"profile_pic_url"`
}

type IDParamReq struct {
	ID uuid.UUID `param:"id" validate:"required"`
}
type GetUserByIDReq struct {
	ID uuid.UUID `param:"id"`
}
type DeleteUserByIDReq struct {
	ID uuid.UUID `param:"id"`
}
type GetUsersReq struct {
	Query          string    `query:"query"`
	Name           string    `query:"name"`
	Limit          int       `query:"limit"`
	Page           int       `query:"page"`
	UserType       string    `query:"user_type"`
	FacultyID      uuid.UUID `query:"faculty_id"`
	StudyProgramID uuid.UUID `query:"study_program_id"`
	Random         bool      `query:"random"`
}

func ConvertUserToUserResponse(user User) (userResponse UserResponse) {
	userResponse.ID = user.ID
	userResponse.CreatedAt = user.CreatedAt
	userResponse.UpdatedAt = user.UpdatedAt
	userResponse.Name = user.Name
	userResponse.ProfilePicURL = user.ProfilePicURL
	userResponse.Email = user.Email
	userResponse.Bio = user.Bio
	userResponse.EksternalLink = user.EksternalLink
	userResponse.Instagram = user.Instagram
	userResponse.Linkedin = user.Linkedin
	userResponse.Whatsapp = user.Whatsapp
	userResponse.UserTypeName = user.UserTypeName
	userResponse.Student = StudentResponse{
		ID:       user.Student.ID,
		NIM:      user.Student.NIM,
		Angkatan: user.Student.Angkatan,
		Faculty: FacultyResponse{
			ID:        user.Student.Faculty.ID,
			CreatedAt: user.Student.Faculty.CreatedAt,
			UpdatedAt: user.Student.Faculty.UpdatedAt,
			Name:      user.Student.Faculty.Name,
		},
		StudyProgram: StudyProgramResponse{
			ID:        user.Student.StudyProgram.ID,
			CreatedAt: user.Student.StudyProgram.CreatedAt,
			UpdatedAt: user.Student.StudyProgram.UpdatedAt,
			Faculty:   user.Student.StudyProgram.Faculty,
			Name:      user.Student.StudyProgram.Name,
		},
	}
	userResponse.Lecturer = LecturerResponse{
		ID:   user.Lecturer.ID,
		NIDN: user.Lecturer.NIDN,
		Faculty: FacultyResponse{
			ID:        user.Lecturer.Faculty.ID,
			CreatedAt: user.Lecturer.Faculty.CreatedAt,
			UpdatedAt: user.Lecturer.Faculty.UpdatedAt,
			Name:      user.Lecturer.Faculty.Name,
		},
		StudyProgram: StudyProgramResponse{
			ID:        user.Lecturer.StudyProgram.ID,
			CreatedAt: user.Lecturer.StudyProgram.CreatedAt,
			UpdatedAt: user.Lecturer.StudyProgram.UpdatedAt,
			Faculty:   user.Lecturer.StudyProgram.Faculty,
			Name:      user.Lecturer.StudyProgram.Name,
		},
	}
	return userResponse
}

// type CreateUserRes struct {
// 	ID            string
// 	Name          string `json:"name"`
// 	ProfilePicURL string `json:"profile_pic_url"`
// 	Email         string `json:"email"`
// 	Password      string `json:"password"`
// }
