from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Payment, PaymentStatus
from schemas import PaymentRequest, PaymentResponse
from uuid import UUID
import secrets
import random
from service_clients import UserServiceClient

payment_router = APIRouter()


def get_user_client() -> UserServiceClient:
    return UserServiceClient()



def detect_card_type(card_number: str) -> str:
    first_digit = card_number[0]
    if first_digit == '4':
        return 'Visa'
    elif first_digit == '5':
        return 'Mastercard'
    elif first_digit == '3':
        return 'American Express'
    else:
        return 'Unknown'


def simulate_payment_processing() -> bool:
    return random.random() > 0.05


@payment_router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def process_payment(
    payment_request: PaymentRequest,
    db: Session = Depends(get_db),
    user_client: UserServiceClient = Depends(get_user_client)
):
    # Validate user exists via User Service API
    if not user_client.user_exists(payment_request.user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found. Please provide a valid user ID."
        )

    card_number_clean = payment_request.card_number.replace(' ', '').replace('-', '')
    card_last_four = card_number_clean[-4:]
    card_type = detect_card_type(card_number_clean)

    transaction_id = f"TXN-{secrets.token_hex(8).upper()}"

    payment_successful = simulate_payment_processing()

    new_payment = Payment(
        user_id=payment_request.user_id,
        amount=payment_request.amount,
        card_last_four=card_last_four,
        card_type=card_type,
        transaction_id=transaction_id,
        status=PaymentStatus.COMPLETED.value if payment_successful else PaymentStatus.FAILED.value
    )

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    if not payment_successful:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment processing failed. Please try again."
        )

    return PaymentResponse(
        id=new_payment.id,
        user_id=new_payment.user_id,
        amount=new_payment.amount,
        card_last_four=new_payment.card_last_four,
        card_type=new_payment.card_type,
        status=new_payment.status,
        transaction_id=new_payment.transaction_id,
        created_at=new_payment.created_at,
        message="Payment processed successfully"
    )

@payment_router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(payment_id: UUID, db: Session = Depends(get_db)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )

    return PaymentResponse(
        id=payment.id,
        user_id=payment.user_id,
        amount=payment.amount,
        card_last_four=payment.card_last_four,
        card_type=payment.card_type,
        status=payment.status.value,
        transaction_id=payment.transaction_id,
        created_at=payment.created_at,
        message="Payment retrieved successfully"
    )
