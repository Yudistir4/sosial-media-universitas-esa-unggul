package impl

import (
	"backend/pkg/dto"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *studyProgramRepository) DeleteStudyProgramsRelatedToUser(UserID uuid.UUID, tx *gorm.DB) error {

	result := r.db.Where("faculty_id = ?", UserID).Delete(&dto.StudyProgram{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}
