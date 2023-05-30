package impl

import (
	"backend/pkg/dto"
	"backend/pkg/utils/cloudinaryutils"
	"context"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func (s *userService) UpdateUserProfilePic(req dto.UpdateProfilePicReq) (res dto.UpdateProfilePicRes, err error) {
	user, err := s.repo.GetUserByID(req.ID)
	if err != nil {
		return dto.UpdateProfilePicRes{}, err
	}

	result, err := cloudinaryutils.UploadFile(cloudinaryutils.UploadParams{Ctx: context.Background(), FilePath: req.ProfilePicSrc, Cld: s.claudinary})
	if err != nil {
		return dto.UpdateProfilePicRes{}, err
	}

	// check if old profile pic exis, remove old profile pic
	if user.ProfilePicPublicID != "" {
		s.log.Warningln("[INFO] start delete old profile pic]")
		_, err := s.claudinary.Upload.Destroy(context.Background(), uploader.DestroyParams{PublicID: user.ProfilePicPublicID})
		if err != nil {
			// TODO remove new pic
			s.log.Warningln("[ERROR] while delete old profile pic]")
			return dto.UpdateProfilePicRes{}, err
		}

	}

	// Replace new profile pic
	user.ProfilePicURL = result.FileURL
	user.ProfilePicPublicID = result.PublicID

	err = s.repo.UpdateUserProfilePic(&user)
	if err != nil {
		return dto.UpdateProfilePicRes{}, err
	}

	res.ProfilePicURL = result.FileURL
	return res, nil
}
