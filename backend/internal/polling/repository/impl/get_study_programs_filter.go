package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *pollingRepository) GetStudyProgramsFilter(FacultyID uuid.UUID) ([]dto.StudyProgramFilterResponse, error) {

	var studyprograms []dto.StudyProgram
	err := r.db.Where("faculty_id = ?", FacultyID).Find(&studyprograms).Error
	if err != nil {
		return []dto.StudyProgramFilterResponse{}, err
	}

	var studyprogramsResponse []dto.StudyProgramFilterResponse
	for _, v := range studyprograms {
		studyprogramsResponse = append(studyprogramsResponse, dto.StudyProgramFilterResponse{
			ID:   v.ID,
			Name: v.Name,
		})

	}
	return studyprogramsResponse, nil
}
