package impl

import (
	"backend/pkg/dto"
	"errors"

	"gorm.io/gorm"
)

func (r *voterRepository) CreateVoter(voters dto.Voter, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	result := tx.Create(&voters)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
