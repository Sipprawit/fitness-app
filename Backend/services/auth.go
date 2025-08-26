package services


import (

   "errors"

   "time"


   jwt "github.com/dgrijalva/jwt-go"

)


// JwtWrapper wraps the signing key and the issuer

type JwtWrapper struct {

   SecretKey       string

   Issuer          string

   ExpirationHours int64

}


// JwtClaim adds email as a claim to the token

type JwtClaim struct {

   Email string

   jwt.StandardClaims

}


// GenerateAccessToken อายุสั้น
func (j *JwtWrapper) GenerateAccessToken(email string) (string, error) {
    claims := &JwtClaim{
        Email: email,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: time.Now().Add(time.Minute * 15).Unix(), // 15 นาที
            Issuer:    j.Issuer,
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(j.SecretKey))
}

// GenerateRefreshToken อายุยาว
func (j *JwtWrapper) GenerateRefreshToken(email string) (string, error) {
    claims := &JwtClaim{
        Email: email,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 วัน
            Issuer:    j.Issuer,
        },
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(j.SecretKey))
}


// Validate Token validates the jwt token

func (j *JwtWrapper) ValidateToken(signedToken string) (*JwtClaim, error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&JwtClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(j.SecretKey), nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*JwtClaim)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}
