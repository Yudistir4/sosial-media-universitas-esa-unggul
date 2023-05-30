package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *facultyRepository) CreateFaculty(name string, tx *gorm.DB) (dto.Faculty, error) {

	faculty := dto.Faculty{
		ID:   uuid.New(),
		Name: name,
	}
	result := tx.Create(&faculty)

	if result.Error != nil {
		r.log.Errorln("[ERROR] Create Faculty Error:", result.Error)
		return faculty, customerrors.GetErrorType(result.Error)
	}

	return faculty, nil
}
