package cloudinaryutils

import (
	"context"
	"fmt"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type UploadParams struct {
	Ctx      context.Context
	Cld      *cloudinary.Cloudinary
	FilePath string
}

type resultUpload struct {
	FileURL string
	PublicID string
}

func UploadFile(params UploadParams) (resultUpload, error) {
	res, err := params.Cld.Upload.Upload(params.Ctx, params.FilePath, uploader.UploadParams{
		Folder:         "sosmed",
		UniqueFilename: api.Bool(true),
		ResourceType:   "auto",
	})

	if err != nil {
		return resultUpload{}, err
	}
	fmt.Println(res.PublicID)
	result := resultUpload{
		FileURL: res.SecureURL,
		PublicID: res.PublicID,
	}
	return result, nil

}
