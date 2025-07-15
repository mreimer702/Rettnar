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
from app.utils.util import user_token_required, admin_token_required

# ========================================
# AUTHENTICATED USER ROUTES
# ========================================

@search_logs_bp.route('/', methods=['POST'])
@user_token_required
@limiter.limit("10 per minute")
def create_search_log(user_id):
    """Create a search log entry for the authenticated user"""
    try:
        data = request.get_json()
        validated_data = search_log_create_schema.load(data)
    except ValidationError as e:
        return jsonify({'errors': e.messages}), 400
    
    location_id = None

    # Create location if location data is provided
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
        location_id = location.location_id
        
    # Create search log for authenticated user
    search_log = SearchLog(
        keyword=validated_data['keyword'],
        user_id=user_id,  # Use authenticated user ID
        location_id=location_id,
        searched_at=datetime.utcnow()
    )

    db.session.add(search_log)
    db.session.commit()

    return search_log_schema.jsonify(search_log), 201

@search_logs_bp.route('/', methods=['GET'])
@user_token_required
def get_user_search_logs(user_id):
    """Get search logs for the authenticated user"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    
    query = select(SearchLog).where(SearchLog.user_id == user_id).order_by(desc(SearchLog.searched_at))
    
    total = db.session.execute(
        select(func.count(SearchLog.search_log_id)).where(SearchLog.user_id == user_id)
    ).scalar()

    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    search_logs = db.session.execute(query).scalars().all()

    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }

    return jsonify({
        'search_logs': search_logs_schema.dump(search_logs),
        'pagination': pagination_info
    }), 200

@search_logs_bp.route('/recent', methods=['GET'])
@user_token_required
@cache.cached(timeout=300)
def get_recent_searches(user_id):
    """Get recent unique search keywords for the authenticated user"""
    limit = request.args.get('limit', 10, type=int)
    limit = min(limit, 50)  # Cap at 50
    
    # Get distinct keywords from recent searches for this user
    query = (
        select(SearchLog.keyword, func.max(SearchLog.searched_at).label('last_searched'))
        .where(SearchLog.user_id == user_id)
        .group_by(SearchLog.keyword)
        .order_by(desc('last_searched'))
        .limit(limit)
    )
    
    results = db.session.execute(query).all()
    
    recent_searches = [
        {'keyword': result.keyword, 'last_searched': result.last_searched}
        for result in results
    ]
    
    return jsonify({'recent_searches': recent_searches}), 200

@search_logs_bp.route('/analytics', methods=['GET'])
@user_token_required
def get_search_analytics(user_id):
    """Get search analytics for the authenticated user"""
    days = request.args.get('days', 30, type=int)
    days = min(days, 365)  # Cap at 1 year
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get top search keywords with counts for this user
    query = (
        select(
            SearchLog.keyword,
            func.count(SearchLog.search_log_id).label('search_count'),
            func.max(SearchLog.searched_at).label('last_searched')
        )
        .where(SearchLog.user_id == user_id, SearchLog.searched_at >= start_date)
        .group_by(SearchLog.keyword)
        .order_by(desc('search_count'))
        .limit(20)
    )
    
    results = db.session.execute(query).all()
    
    analytics = [
        {
            'keyword': result.keyword,
            'search_count': result.search_count,
            'last_searched': result.last_searched
        }
        for result in results
    ]
    
    return jsonify({'analytics': analytics}), 200

@search_logs_bp.route('/<int:search_log_id>', methods=['DELETE'])
@user_token_required
@limiter.limit("10 per minute")
def delete_search_log(user_id, search_log_id):
    """Delete a specific search log entry (own entries only)"""
    search_log = db.session.execute(
        select(SearchLog).where(
            SearchLog.search_log_id == search_log_id,
            SearchLog.user_id == user_id
        )
    ).scalars().first()

    if not search_log:
        return jsonify({'error': 'Search log not found'}), 404

    db.session.delete(search_log)
    db.session.commit()

    return jsonify({'message': 'Search log deleted successfully'}), 200

@search_logs_bp.route('/clear', methods=['DELETE'])
@user_token_required
@limiter.limit("5 per minute")
def clear_search_history(user_id):
    """Clear all search history for the authenticated user"""
    db.session.execute(
        SearchLog.__table__.delete().where(SearchLog.user_id == user_id)
    )
    db.session.commit()

    return jsonify({'message': 'Search history cleared successfully'}), 200

# ========================================
# PUBLIC ROUTES (No Authentication Required)
# ========================================

@search_logs_bp.route('/popular', methods=['GET'])
@cache.cached(timeout=3600)  # Cache for 1 hour
def get_popular_searches():
    """Public: Get popular search keywords across all users"""
    days = request.args.get('days', 7, type=int)
    days = min(days, 30)  # Cap at 30 days
    limit = request.args.get('limit', 10, type=int)
    limit = min(limit, 50)  # Cap at 50
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    query = (
        select(
            SearchLog.keyword,
            func.count(SearchLog.search_log_id).label('search_count')
        )
        .where(SearchLog.searched_at >= start_date)
        .group_by(SearchLog.keyword)
        .order_by(desc('search_count'))
        .limit(limit)
    )
    
    results = db.session.execute(query).all()
    
    popular_searches = [
        {'keyword': result.keyword, 'search_count': result.search_count}
        for result in results
    ]
    
    return jsonify({'popular_searches': popular_searches}), 200

# ========================================
# ADMIN-ONLY ROUTES
# ========================================

@search_logs_bp.route('/admin/all', methods=['GET'])
@admin_token_required
def admin_get_all_search_logs(user_id):
    """Admin: Get all search logs with pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 50, type=int), 100)
    
    query = select(SearchLog).order_by(desc(SearchLog.searched_at))
    total = db.session.execute(select(func.count(SearchLog.search_log_id))).scalar()
    
    offset = (page - 1) * per_page
    search_logs = db.session.execute(query.offset(offset).limit(per_page)).scalars().all()
    
    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }
    
    return jsonify({
        'search_logs': search_logs_schema.dump(search_logs),
        'pagination': pagination_info
    }), 200

@search_logs_bp.route('/admin/analytics', methods=['GET'])
@admin_token_required
def admin_get_search_analytics(user_id):
    """Admin: Get comprehensive search analytics"""
    days = request.args.get('days', 30, type=int)
    days = min(days, 365)  # Cap at 1 year
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get top search keywords across all users
    query = (
        select(
            SearchLog.keyword,
            func.count(SearchLog.search_log_id).label('search_count'),
            func.count(func.distinct(SearchLog.user_id)).label('unique_users'),
            func.max(SearchLog.searched_at).label('last_searched')
        )
        .where(SearchLog.searched_at >= start_date)
        .group_by(SearchLog.keyword)
        .order_by(desc('search_count'))
        .limit(50)
    )
    
    results = db.session.execute(query).all()
    
    analytics = [
        {
            'keyword': result.keyword,
            'search_count': result.search_count,
            'unique_users': result.unique_users,
            'last_searched': result.last_searched
        }
        for result in results
    ]
    
    return jsonify({'analytics': analytics}), 200

@search_logs_bp.route('/admin/<int:search_log_id>', methods=['DELETE'])
@admin_token_required
@limiter.limit("10 per minute")
def admin_delete_search_log(user_id, search_log_id):
    """Admin: Delete any search log entry"""
    search_log = db.session.execute(
        select(SearchLog).where(SearchLog.search_log_id == search_log_id)
    ).scalars().first()

    if not search_log:
        return jsonify({'error': 'Search log not found'}), 404

    db.session.delete(search_log)
    db.session.commit()

    return jsonify({'message': 'Search log deleted by admin'}), 200