package impl

import (
	"github.com/google/uuid"
)

func (s *studyProgramService) DeleteStudyProgram(ID uuid.UUID) error {
	return s.repo.DeleteStudyProgramByID(ID)
}
