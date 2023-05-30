package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *studyProgramRepository) GetStudyProgramByID(ID uuid.UUID) (dto.StudyProgram, error) {

	var studyProgram dto.StudyProgram
	result := r.db.Preload("Faculty").First(&studyProgram, ID)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return dto.StudyProgram{}, customerrors.ErrRecordNotFound
		}
		return dto.StudyProgram{}, result.Error

	}
	return studyProgram, nil
}
