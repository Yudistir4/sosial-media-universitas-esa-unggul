package impl

import (
	"backend/pkg/dto"
)

func (r *studentRepository) GetStudents() (*[]dto.Student, error) {

	var students []dto.Student
	r.db.Preload("Faculty").Find(&students)
	return &students, nil
}
