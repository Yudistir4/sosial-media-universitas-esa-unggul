package impl

import (
	"backend/pkg/dto"
	customerrors "backend/pkg/errors"
)

func (r *userRepository) UpdateUserProfile(req *dto.UpdateUserProfileReq) (dto.User, error) {
	user, err := r.GetUserByID(req.ID)
	if err != nil {
		return dto.User{}, err
	}
	user.Bio = req.Bio
	user.EksternalLink = req.EksternalLink
	user.Instagram = req.Instagram
	user.Linkedin = req.Linkedin
	user.Whatsapp = req.Whatsapp
	result := r.db.Save(&user)
	if result.Error != nil {
		r.log.Errorln("[ERROR] Update User Profile Error:", result.Error)
		return dto.User{}, customerrors.GetErrorType(result.Error)
	}
	return user, nil
}
