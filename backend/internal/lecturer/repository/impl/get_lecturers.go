package impl

import (
	"backend/pkg/dto"
)

func (r *lecturerRepository) GetLecturers() (*[]dto.Lecturer, error) {

	var lecturers []dto.Lecturer
	r.db.Preload("Faculty").Find(&lecturers)
	return &lecturers, nil
}
