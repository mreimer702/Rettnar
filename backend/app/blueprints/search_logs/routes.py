from flask import request, jsonify
from sqlalchemy import select, func, desc, distinct
from marshmallow import ValidationError
from datetime import datetime, timedelta

from app.models import SearchLog, Location, User, db
from app.blueprints.search_logs.schemas import (
    search_log_schema,
    search_logs_schema,
    search_log_create_schema,
    search_analytics_schema
)
from app.blueprints.search_logs import search_logs_bp
from app.extensions import cache, limiter
from app.utils.util import user_token_required

@search_logs_bp.route('/', methods=['POST'])
@user_token_required
@limiter.limit("10 per minute")
def create_search_log(user_id):
    
    try:
        data = request.get_json()
        validated_data = search_log_create_schema.load(data)

    except ValidationError as e:
        return jsonify({'errors': e.messages}), 400
    
    location_id = None

    if any(field in validated_data for field in ['address', 'city', 'state', 'country', 'zip_code']):
        location = Location(
            address=validated_data.get('address', ''),
            city=validated_data.get('city', ''),
            state=validated_data.get('state', ''),
            country=validated_data.get('country', ''),
            zip_code=validated_data.get('zip_code', ''),
            latitude=validated_data.get('latitude'),
            longitude=validated_data.get('longitude')
        )

        db.session.add(location)
        db.session.flush()

        location_id = location.location.id
        
    search_log = SearchLog(
        keyword=validated_data['keyword'],
        user_id=user_id,
        location_id=location_id,
        searched_at=datetime.utcnow()
    )

    db.session.add(search_log)
    db.session.commit()

    return search_log_schema.jsonify(search_log), 201

