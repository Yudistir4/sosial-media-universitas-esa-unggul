package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"gorm.io/gorm"
)

func (r *authRepository) GetUserByEmail(email string) (dto.User, error) {
	var user dto.User
	result := r.db.
		Preload("Student").Preload("Student.Faculty").Preload("Student.StudyProgram").
		Preload("Lecturer").Preload("Lecturer.Faculty").Preload("Lecturer.StudyProgram").
		Where("email = ?", email).
		First(&user)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return dto.User{}, customerrors.ErrAccountNotFound
		}
		r.log.Println("[ERROR GetUserByEmail] :", result.Error)
		return dto.User{}, result.Error
	}
	return user, nil
}
