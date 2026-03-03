import os

# Use in-memory SQLite for tests
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from fastapi.testclient import TestClient

from app.database import init_db
from app.main import app

client = TestClient(app)


def setup_function():
    """Reset database before each test."""
    init_db()


def test_signup_success():
    res = client.post(
        "/api/auth/signup",
        json={
            "email": "test@example.com",
            "password": "password123",
            "full_name": "Test User",
        },
    )
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_signup_duplicate_email():
    client.post(
        "/api/auth/signup",
        json={
            "email": "dupe@example.com",
            "password": "password123",
            "full_name": "User One",
        },
    )
    res = client.post(
        "/api/auth/signup",
        json={
            "email": "dupe@example.com",
            "password": "password456",
            "full_name": "User Two",
        },
    )
    assert res.status_code == 409


def test_signup_short_password():
    res = client.post(
        "/api/auth/signup",
        json={
            "email": "short@example.com",
            "password": "1234567",
            "full_name": "Short Pass",
        },
    )
    assert res.status_code == 422


def test_signin_success():
    client.post(
        "/api/auth/signup",
        json={
            "email": "signin@example.com",
            "password": "password123",
            "full_name": "Sign In User",
        },
    )
    res = client.post(
        "/api/auth/signin",
        json={"email": "signin@example.com", "password": "password123"},
    )
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_signin_wrong_password():
    client.post(
        "/api/auth/signup",
        json={
            "email": "wrong@example.com",
            "password": "password123",
            "full_name": "Wrong Pass",
        },
    )
    res = client.post(
        "/api/auth/signin",
        json={"email": "wrong@example.com", "password": "wrongpassword"},
    )
    assert res.status_code == 401


def test_signin_nonexistent_user():
    res = client.post(
        "/api/auth/signin",
        json={"email": "nobody@example.com", "password": "password123"},
    )
    assert res.status_code == 401


def test_me_with_token():
    signup_res = client.post(
        "/api/auth/signup",
        json={
            "email": "me@example.com",
            "password": "password123",
            "full_name": "Me User",
        },
    )
    token = signup_res.json()["access_token"]
    res = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "me@example.com"
    assert data["full_name"] == "Me User"


def test_me_without_token():
    res = client.get("/api/auth/me")
    assert res.status_code in (401, 403)


def test_me_with_invalid_token():
    res = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer invalid-token"},
    )
    assert res.status_code == 401
