package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *userRepository) GetUserByID(ID uuid.UUID) (dto.User, error) {
	var users dto.User
	err := r.db.Preload("Student").Preload("Student.Faculty").Preload("Student.StudyProgram").
		Preload("Lecturer").Preload("Lecturer.Faculty").Preload("Lecturer.StudyProgram").
		First(&users, ID).Error
	if err != nil {
		return dto.User{}, err
	}

	return users, nil
}
