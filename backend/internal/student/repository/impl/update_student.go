package impl

import (
	"backend/pkg/dto"
	"errors"
	"fmt"

	customerrors "backend/pkg/errors"

	"gorm.io/gorm"
)

func (r *studentRepository) UpdateStudent(req *dto.UpdateUserReq, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	// if !exist -> create
	ok, err := r.IsBatchExist(req.BatchYear)
	if err != nil {
		return err
	}
	if !ok {
		if err = r.CreateBatch(req.BatchYear, tx); err != nil {
			return err
		}
	}

	student, err := r.GetStudentByID(req.ID)
	if err != nil {
		return err
	}

	oldBatchYear := student.BatchYear
	// Replace New Data
	student.NIM = req.NIM
	student.BatchYear = req.BatchYear
	student.FacultyID = req.FacultyID
	student.StudyProgramID = req.StudyProgramID
	student.IsGraduated = req.IsGraduated
	student.CampusLocation = req.CampusLocation

	result := tx.Save(student)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Update Student Error:", result.Error)
		return customerrors.GetErrorType(result.Error)
	}

	// if old BatchYear !exist anymore in students -> delete
	if req.BatchYear != oldBatchYear {
		ok, err = r.IsBatchExistInOthersStudents(oldBatchYear, student.ID)
		if err != nil {
			return err
		}
		fmt.Println(ok)

		if !ok {
			err = r.DeleteBatch(oldBatchYear, tx)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
