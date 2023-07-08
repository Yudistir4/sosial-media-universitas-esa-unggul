package impl

import (
	"backend/pkg/dto"
)

func (r *pollingRepository) GetFacultysFilter() ([]dto.FacultyFilterResponse, error) {

	var facultys []dto.Faculty
	err := r.db.Find(&facultys).Error
	if err != nil {
		return []dto.FacultyFilterResponse{}, err
	}

	var facultysResponse []dto.FacultyFilterResponse
	for _, v := range facultys {
		facultysResponse = append(facultysResponse, dto.FacultyFilterResponse{
			ID:   v.ID,
			Name: v.Name,
		})

	}
	return facultysResponse, nil
}
