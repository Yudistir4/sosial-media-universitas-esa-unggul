package impl

import (
	"backend/pkg/dto"
	"backend/pkg/utils/passwordutils"
	"backend/pkg/utils/randomutils"
)

func (s *userService) UpdateUser(req dto.UpdateUserReq) (userResponse dto.UserResponse, err error) {
	user, err := s.repo.GetUserByID(req.ID)
	if err != nil {
		return dto.UserResponse{}, err
	}

	tx := s.db.Begin()
	if tx.Error != nil {
		return dto.UserResponse{}, tx.Error
	}
	 

	if user.UserTypeName == "student" {
		//  Update Student
		err = s.repoStudent.UpdateStudent(&req, tx)

	} else if user.UserTypeName == "lecturer" {
		//  Update Lecturer
		err = s.repoLecturer.UpdateLecturer(&req, tx)
	} else if user.UserTypeName == "faculty" {
		//  Update Faculty
		err = s.repoFaculty.UpdateFaculty(&req, tx)
	} else if user.UserTypeName == "university" {
		//  kayanya diapus aja deh
	}

	// if error, rollback
	if err != nil {
		tx.Rollback()
		return dto.UserResponse{}, err
	}

	// if new email,CreatePassword and sendNewPassword with email
	if user.Email != req.Email {
		password := randomutils.GenerateRandomString(6)
		if s.config.Server.Environment == "dev" {
			password = "654321"
		}
		user.Password = passwordutils.HashPassword(password)
		if s.config.Server.Environment != "dev" {
			err = s.SendPasswordToUserEmail(password, req.Email)
			if err != nil {
				tx.Rollback()
				return dto.UserResponse{}, err
			}
		}
	}

	// Assign New Data To User
	user.Name = req.Name
	user.Email = req.Email
	// Update User
	err = s.repo.UpdateUser(&user, tx)

	// if error, rollback
	if err != nil {
		tx.Rollback()
		return dto.UserResponse{}, err
	}

	tx.Commit()

	user, err = s.repo.GetUserByID(user.ID)
	userResponse = dto.ConvertUserToUserResponse(user)

	return userResponse, nil
}
