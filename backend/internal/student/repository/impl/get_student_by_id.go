package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *studentRepository) GetStudentByID(ID uuid.UUID) (dto.Student, error) {
	var student dto.Student
	r.db.First(&student, ID)
	return student, nil
}
