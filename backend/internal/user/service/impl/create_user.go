package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"backend/pkg/utils/passwordutils"
	"backend/pkg/utils/randomutils"
)

func (s *userService) CreateUser(req dto.CreateUserReq) (userResponse dto.UserResponse, err error) {
	password := randomutils.GenerateRandomString(6)
	if s.config.Server.Environment == "dev" {
		password = "123456"
	}
	req.Password = passwordutils.HashPassword(password)

	tx := s.db.Begin()
	if tx.Error != nil {
		return dto.UserResponse{}, tx.Error
	}
	var user dto.User

	if req.UserType == "student" {
		// Check faculty and studyprograms is exist
		// create student
		var student dto.Student
		student, err = s.repoStudent.CreateStudent(req, tx)
		if err != nil {
			tx.Rollback()
			return dto.UserResponse{}, err
		}
		// create user
		user, err = s.repo.CreateUserStudent(req, student.ID, tx)

	} else if req.UserType == "lecturer" {
		var lecturer dto.Lecturer
		lecturer, err = s.repoLecturer.CreateLecturer(req, tx)
		if err != nil {
			tx.Rollback()
			return dto.UserResponse{}, err
		}
		// create user
		user, err = s.repo.CreateUserLecturer(req, lecturer.ID, tx)

	} else if req.UserType == "faculty" {
		_, err = s.repo.GetUserByName(req.Name, req.UserType)
		if err != nil {
			if err != customerrors.ErrUserNotFound {
				return dto.UserResponse{}, err
			}
		} else if err == nil {
			return dto.UserResponse{}, customerrors.ErrDuplicatedFacultyName
		}

		var faculty dto.Faculty
		faculty, err = s.repoFaculty.CreateFaculty(req.Name, tx)
		if err != nil {
			tx.Rollback()
			return dto.UserResponse{}, err
		}
		user, err = s.repo.CreateUserFaculty(req, faculty.ID, tx)

	} else if req.UserType == "university" {
		user, err = s.repo.CreateUserUniversity(req, tx)
	}
	if err != nil {
		tx.Rollback()
		return dto.UserResponse{}, err
	}

	// Send Email
	if s.config.Server.Environment != "dev" {
		err = s.SendPasswordToUserEmail(password, req.Email)
		if err != nil {
			tx.Rollback()
			return dto.UserResponse{}, err
		}
	}

	tx.Commit()

	user, err = s.repo.GetUserByID(user.ID)

	userResponse = dto.ConvertUserToUserResponse(user)

	return userResponse, nil
}
