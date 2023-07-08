package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
)

func (r *pollingRepository) GetBatchesFilter(FacultyID uuid.UUID, StudyProgramID uuid.UUID) ([]int, error) {

	var years []int

	result := r.db.Distinct("batch_year").Order("batch_year").Where("faculty_id = ? AND study_program_id = ?", FacultyID, StudyProgramID).Find(&dto.Student{})
	if result.Error != nil {
		return nil, result.Error
	}

	err := result.Pluck("batch_year", &years).Error
	if err != nil {
		return nil, err
	}

	return years, nil
}
