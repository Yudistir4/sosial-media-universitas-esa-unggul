package impl

import (
	"backend/pkg/dto"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

func (r *voterRepository) CreateVoters(voters []*dto.Voter, tx *gorm.DB) error {
	if tx == nil {
		return errors.New("transaction not started")
	}

	fmt.Println(voters)
	result := tx.Create(&voters)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
