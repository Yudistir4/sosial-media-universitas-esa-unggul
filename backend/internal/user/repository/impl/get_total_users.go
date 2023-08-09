package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
)

func (r *userRepository) GetTotalUsers(req dto.GetUsersReq) (int64, error) {

	var totalUsers int64
	query := r.db.Model(&dto.User{}).
		Joins("Student").Joins("Student.Faculty").Joins("Student.StudyProgram").
		Joins("Lecturer").Joins("Lecturer.Faculty").Joins("Lecturer.StudyProgram")

	if req.Query != "" {
		query = query.Where("users.name LIKE ? OR Student.nim LIKE ? OR Lecturer.nidn LIKE ?", "%"+req.Query+"%", "%"+req.Query+"%", "%"+req.Query+"%")
	} else if req.UserType != "" && req.Name != "" && req.FacultyID != uuid.Nil {
		query = query.Where("users.user_type_name = ? AND users.name LIKE ? AND (Student.faculty_id = ? OR Lecturer.faculty_id = ?)", req.UserType, "%"+req.Name+"%", req.FacultyID, req.FacultyID)
	} else if req.UserType == "student" && req.Year != 0 && req.FacultyID != uuid.Nil && req.StudyProgramID != uuid.Nil {
		query = query.Where("users.user_type_name = ? AND (Student.faculty_id = ? AND Student.study_program_id = ? AND Student.batch_year = ?)", req.UserType, req.FacultyID, req.StudyProgramID, req.Year)
	} else if req.UserType != "" && req.FacultyID != uuid.Nil && req.StudyProgramID != uuid.Nil {
		query = query.Where("users.user_type_name = ? AND ((Student.faculty_id = ? AND Student.study_program_id = ?) OR (Lecturer.faculty_id = ? AND Lecturer.study_program_id = ?))", req.UserType, req.FacultyID, req.StudyProgramID, req.FacultyID, req.StudyProgramID)
	} else if req.UserType != "" && req.FacultyID != uuid.Nil {
		query = query.Where("users.user_type_name = ? AND (Student.faculty_id = ? OR Lecturer.faculty_id = ?)", req.UserType, req.FacultyID, req.FacultyID)
	} else if req.UserType != "" && req.StudyProgramID != uuid.Nil {
		query = query.Where("users.user_type_name = ? AND (Student.study_program_id = ? OR Lecturer.study_program_id = ?)", req.UserType, req.StudyProgramID, req.StudyProgramID)
	} else if req.UserType != "" && req.Name != "" {
		query = query.Where("users.user_type_name = ? AND users.name LIKE ?", req.UserType, "%"+req.Name+"%")
	} else if req.UserType != "" {
		query = query.Where("users.user_type_name = ? ", req.UserType)
	} else if req.FacultyID != uuid.Nil && req.StudyProgramID != uuid.Nil {
		query = query.Where("(Student.faculty_id = ? AND Student.study_program_id = ?) OR (Lecturer.faculty_id = ? AND Lecturer.study_program_id = ?)", req.FacultyID, req.StudyProgramID, req.FacultyID, req.StudyProgramID)
	} else if req.FacultyID != uuid.Nil {
		query = query.Where("Student.faculty_id = ? OR Lecturer.faculty_id = ?", req.FacultyID, req.FacultyID)
	} else if req.StudyProgramID != uuid.Nil {
		query = query.Where("Student.study_program_id = ? OR Lecturer.study_program_id = ?", req.StudyProgramID, req.StudyProgramID)
	}

	result := query.Count(&totalUsers)
	if result.Error != nil {
		r.log.Errorln("[ERROR] get total users:", result.Error)
		return 0, customerrors.GetErrorType(result.Error)
	}
	return totalUsers, nil
}
