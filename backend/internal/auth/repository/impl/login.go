package impl

import (
	"backend/pkg/dto"
)

func (r *authRepository) Login(req dto.LoginReq) (dto.User, error) {
	var user dto.User
	result := r.db.
		Preload("Student").Preload("Student.Faculty").Preload("Student.StudyProgram").
		Preload("Lecturer").Preload("Lecturer.Faculty").Preload("Lecturer.StudyProgram").
		Where("email = ?", req.Email).
		First(&user)
	if result.Error != nil {
		r.log.Println(result.Error)
		return dto.User{}, result.Error
	}
	return user, nil
}
