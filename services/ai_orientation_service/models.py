from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid
from datetime import datetime

class OrientationQuery(Base):
    __tablename__ = "orientation_queries"
    __table_args__ = {'schema': 'ai_service'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    symptoms = Column(Text, nullable=False)
    recommended_specialty = Column(String, nullable=False)
    confidence = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
