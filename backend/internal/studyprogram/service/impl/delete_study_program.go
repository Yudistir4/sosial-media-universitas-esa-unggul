package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
)

func (s *studyProgramService) DeleteStudyProgram(ID uuid.UUID) error {
	totalStudents, err := s.repoUser.GetTotalUsers(dto.GetUsersReq{UserType: "student", StudyProgramID: ID})
	if err != nil {
		return err
	}
	totalLecturers, err := s.repoUser.GetTotalUsers(dto.GetUsersReq{UserType: "lecturer", StudyProgramID: ID})
	if err != nil {
		return err
	}
	s.log.Infoln("[INFO] total students : ", totalStudents)
	s.log.Infoln("[INFO] total lecturers: ", totalLecturers)

	if totalStudents > 0 || totalLecturers > 0 {
		return customerrors.ErrStudentAndLecturerStillRelatedToThisStudyProgram
	}
	return s.repo.DeleteStudyProgramByID(ID)
}
