package impl

import (
	"backend/pkg/dto"

	customerrors "backend/pkg/errors"
)

func (r *studentRepository) GetBatchs() ([]int, error) {
	var batchs []dto.Batch
	result := r.db.Order("year ASC").Find(&batchs)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Get Batch Error:", result.Error)
		return []int{}, customerrors.GetErrorType(result.Error)
	}

	var BatchYears []int
	for _, batch := range batchs {
		BatchYears = append(BatchYears, batch.Year)
	}

	return BatchYears, nil
}
