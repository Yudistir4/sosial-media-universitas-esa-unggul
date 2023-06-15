package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
)

func (r *userRepository) GetUsers(req dto.GetUsersReq) ([]dto.User, error) {

	offset := (req.Page - 1) * req.Limit
	var users []dto.User
	query := r.db.
		Joins("Student").Joins("Student.Faculty").Joins("Student.StudyProgram").
		Joins("Lecturer").Joins("Lecturer.Faculty").Joins("Lecturer.StudyProgram").
		Limit(req.Limit).Offset(offset).Order("created_at desc")

	if req.Query != "" {
		query = query.Where("users.name LIKE ? OR Student.nim LIKE ? OR Lecturer.nidn LIKE ?", "%"+req.Query+"%", "%"+req.Query+"%", "%"+req.Query+"%")
	} else if req.UserType != "" && req.Name != "" {
		query = query.Where("users.user_type_name = ? AND users.name LIKE ?", req.UserType, "%"+req.Name+"%")
	} else if req.UserType != "" {
		query = query.Where("users.user_type_name = ? ", req.UserType)
	} else if req.FacultyID != uuid.Nil {
		query = query.Where("Student.faculty_id = ? OR Lecturer.faculty_id = ?", req.FacultyID, req.FacultyID)
	} else if req.StudyProgramID != uuid.Nil {
		query = query.Where("Student.study_program_id = ? OR Lecturer.study_program_id = ?", req.StudyProgramID, req.StudyProgramID)
	}

	result := query.Find(&users)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Create User Student Error:", result.Error)
		return []dto.User{}, customerrors.GetErrorType(result.Error)
	}
	return users, nil
}
