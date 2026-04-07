from src.api.auth import get_password_hash, verify_password, create_access_token
import jwt

SECRET_KEY = "super-secret-key"
ALGORITHM = "HS256"

def test_password_hashing():
    password = "minhasenha123"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("senhaerrada", hashed) is False

def test_create_access_token():
    data = {"sub": "user_test"}
    token = create_access_token(data)
    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert decoded["sub"] == "user_test"
    assert "exp" in decoded
