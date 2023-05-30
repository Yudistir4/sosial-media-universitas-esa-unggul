package impl

import (
	"context"

	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/google/uuid"
)

func (s *userService) DeleteUserProfilePic(ID uuid.UUID) error {
	user, err := s.repo.GetUserByID(ID)
	if err != nil {
		return err
	}

	// check if old profile pic exis, remove old profile pic
	if user.ProfilePicPublicID != "" {
		_, err := s.claudinary.Upload.Destroy(context.Background(), uploader.DestroyParams{PublicID: user.ProfilePicPublicID})
		if err != nil {
			s.log.Warningln("[ERROR] while delete old profile pic]")
			return err
		}

	}

	// Replace new profile pic
	user.ProfilePicURL = ""
	user.ProfilePicPublicID = ""

	err = s.repo.UpdateUserProfilePic(&user)
	if err != nil {
		return err
	}

	return nil
}
