package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *facultyRepository) GetFacultyByID(ID uuid.UUID) (dto.Faculty, error) {
	var faculty dto.Faculty
	result := r.db.First(&faculty, ID)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			r.log.Warningln("[ERROR GetFacultyByID] :", result.Error)
			return dto.Faculty{}, customerrors.ErrAccountNotFound
		}
		r.log.Warningln("[ERROR GetFacultyByID] :", result.Error)
		return dto.Faculty{}, result.Error
	}
	return faculty, nil
}
