package httputils

import (
	"backend/pkg/utils/fileutils"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"os"
	"path"
	"time"
)

func HandleFileForm(file *multipart.FileHeader) (string, error) {
	fileutils.CheckUploadFolder()
	filename := path.Join("uploads", fmt.Sprintf("%d-%s", time.Now().UnixMilli(), file.Filename))

	fileSrc, err := file.Open()
	if err != nil {
		log.Println("[HandleFileForm]", err.Error())
		return "", err
	}
	defer fileSrc.Close()

	fileDst, err := os.Create(filename)
	if err != nil {
		log.Println("[HandleFileForm]", err.Error())
		os.Remove(filename)
		return "", err
	}
	defer fileDst.Close()

	_, err = io.Copy(fileDst, fileSrc)
	if err != nil {
		log.Println("[HandleFileForm]", err.Error())
		os.Remove(filename)
		return "", err
	}

	return filename, nil
}
