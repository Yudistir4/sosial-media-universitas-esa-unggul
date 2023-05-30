package impl

import (
	"github.com/google/uuid"
)

func (r *studyProgramRepository) DeleteStudyProgramByID(ID uuid.UUID) error {

	studyProgram, err := r.GetStudyProgramByID(ID)
	if err != nil {
		return err
	}


	result:= r.db.Delete(&studyProgram)
	if result.Error != nil{
		return result.Error
	}
	return nil
}
