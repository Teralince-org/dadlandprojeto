from django.http import JsonResponse
from django.db import connection
from django.db.utils import OperationalError


def health_check(request):
    db_status = "up"
    status_code = 200

    try:
        # Tenta forçar uma conexão rápida com o PostgreSQL
        connection.ensure_connection()
    except OperationalError:
        db_status = "down"
        status_code = 503  # 503 Service Unavailable

    return JsonResponse(
        {
            "api": "up",
            "database": db_status,
            "environment": "development",
        },
        status=status_code,
    )
