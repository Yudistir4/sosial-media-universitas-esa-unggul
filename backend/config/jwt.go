package config

type JWTConfig struct {
	AccessSecretKey         string `validate:"required"`
	RefreshSecretKey        string `validate:"required"`
	ExpiredAccessSecretKey  int    `validate:"required"`
	ExpiredRefreshSecretKey int    `validate:"required"`
}
