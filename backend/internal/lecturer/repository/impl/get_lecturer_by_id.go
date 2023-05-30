package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (r *lecturerRepository) GetLecturerByID(ID uuid.UUID) (dto.Lecturer, error) {
	var lecturer dto.Lecturer
	result := r.db.First(&lecturer, ID)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			r.log.Warningln("[ERROR GetLecturerByID] :", result.Error)
			return dto.Lecturer{}, customerrors.ErrAccountNotFound
		}
		r.log.Warningln("[ERROR GetLecturerByID] :", result.Error)
		return dto.Lecturer{}, result.Error
	}
	return lecturer, nil
}
