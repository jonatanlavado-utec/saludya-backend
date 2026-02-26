"""
HTTP client for inter-service communication.
Payment Service uses this to validate references with other services.
"""
import httpx
from typing import Optional
from uuid import UUID
import os

class ServiceClient:
    """Base client for inter-service communication."""

    def __init__(self, base_url: str, timeout: float = 10.0):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.client = httpx.Client(timeout=timeout)

    def close(self):
        self.client.close()

    def _build_url(self, path: str) -> str:
        return f"{self.base_url}/{path.lstrip('/')}"

    def get(self, path: str) -> Optional[dict]:
        """Make a GET request to another service."""
        try:
            response = self.client.get(self._build_url(path))
            if response.status_code == 404:
                return None
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError:
            return None


class UserServiceClient(ServiceClient):
    """Client for User Service API."""

    def __init__(self, base_url: str = None):
        base_url = base_url or os.getenv("USER_SERVICE_URL", "http://proxy/api/users/")
        super().__init__(base_url)

    def get_user(self, user_id: UUID) -> Optional[dict]:
        """Get user by ID. Returns None if user not found."""
        return self.get(f"/{user_id}")

    def user_exists(self, user_id: UUID) -> bool:
        """Check if a user exists."""
        return self.get_user(user_id) is not None

