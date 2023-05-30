package impl

import "github.com/google/uuid"

func (s *userService) DeleteUser(ID uuid.UUID) (err error) {
	user, err := s.repo.GetUserByID(ID)
	if err != nil {
		return err
	}

	tx := s.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}
	// var user dto.User

	// TODO get all post
	// TODO get all post image/video link
	// TODO Delete all post

	// Delete User
	err = s.repo.DeleteUser(&user, tx)
	// if error, rollback
	if err != nil {
		tx.Rollback()
		return err
	}
	if user.UserTypeName == "student" {
		// Delete Student
		err = s.repoStudent.DeleteStudentByID(ID, tx)
	} else if user.UserTypeName == "lecturer" {
		// Delete Lecturer
		err = s.repoLecturer.DeleteLecturerByID(ID, tx)
	} else if user.UserTypeName == "faculty" {

		// TODO Check IF StudyProgram still related, return err
		// Delete Faculty
		err = s.repoFaculty.DeleteFacultyByID(ID, tx)
	}

	// if error, rollback
	if err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()

	// TODO Delete all image/video
	// TODO if err, rollback

	return nil
}
