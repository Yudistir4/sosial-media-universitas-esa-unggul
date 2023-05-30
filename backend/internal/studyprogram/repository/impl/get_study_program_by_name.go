package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
	"strings"

	"gorm.io/gorm"
)

func (r *studyProgramRepository) GetStudyProgramByName(Name string) (dto.StudyProgram, error) {

	var studyProgram dto.StudyProgram
	result := r.db.Where("LOWER(name) = ?", strings.ToLower(Name)).First(&studyProgram)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return dto.StudyProgram{}, customerrors.ErrStudyProgramNotFound
		}
		return dto.StudyProgram{}, result.Error
	}
	return studyProgram, nil
}
