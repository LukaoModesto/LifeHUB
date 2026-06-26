from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    environment: str = "development"

    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    database_url: str = "sqlite:///./lifehub.db"

    frontend_url: str = "http://localhost:5173"
    frontend_urls: str | None = None

    google_client_id: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        if self.frontend_urls:
            return [
                origin.strip()
                for origin in self.frontend_urls.split(",")
                if origin.strip()
            ]

        return [self.frontend_url]


settings = Settings()