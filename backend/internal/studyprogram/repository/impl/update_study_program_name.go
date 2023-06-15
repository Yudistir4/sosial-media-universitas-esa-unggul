package impl

import (
	"backend/pkg/dto"
)

func (r *studyProgramRepository) UpdateStudyProgramName(req dto.UpdateStudyProgramNameReq) (dto.StudyProgram, error) {

	studyProgram, err := r.GetStudyProgramByID(req.ID)
	if err != nil {
		return dto.StudyProgram{}, err
	}
	studyProgram.Name = req.Name
	result := r.db.Save(&studyProgram)
	if result.Error != nil {
		return dto.StudyProgram{}, result.Error
	}
	return studyProgram, nil
}
