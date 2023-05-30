package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *userRepository) GetUserByID(ID uuid.UUID) (dto.User, error) {
	var users dto.User
	err := r.db.Preload("Student").Preload("Student.Faculty").Preload("Student.StudyProgram").
		Preload("Lecturer").Preload("Lecturer.Faculty").Preload("Lecturer.StudyProgram").
		First(&users, ID).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return dto.User{}, customerrors.ErrUserNotFound
		}
		return dto.User{}, err
	}

	return users, nil
}
