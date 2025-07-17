from flask import request, jsonify
from sqlalchemy import select, func, desc, and_
from marshmallow import ValidationError
from datetime import datetime

from app.models import GeneralNotification, DeliveryNotification, User, Delivery, db
from app.blueprints.notifications.schemas import (
    general_notification_schema,
    general_notifications_schema,
    general_notification_create_schema,
    general_notification_update_schema,
    delivery_notification_schema,
    delivery_notifications_schema,
    delivery_notification_create_schema,
    bulk_notification_create_schema
)
from app.blueprints.notifications import notifications_bp
from app.utils.util import user_token_required, admin_token_required
from app.extensions import limiter

# ========================================
# AUTHENTICATED USER ROUTES - GENERAL NOTIFICATIONS
# ========================================

@notifications_bp.route('/general', methods=['GET'])
@user_token_required
def get_user_notifications(user_id):
    """Get all general notifications for the authenticated user"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    is_read = request.args.get('is_read', type=bool)

    query = select(GeneralNotification).where(GeneralNotification.user_id == user_id)
    
    if is_read is not None:
        query = query.where(GeneralNotification.is_read == is_read)
    
    query = query.order_by(desc(GeneralNotification.created_at))

    # Get total count
    total_query = select(func.count(GeneralNotification.notification_id)).where(
        GeneralNotification.user_id == user_id
    )
    if is_read is not None:
        total_query = total_query.where(GeneralNotification.is_read == is_read)

    total = db.session.execute(total_query).scalar()

    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    notifications = db.session.execute(query).scalars().all()

    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }

    return jsonify({
        'notifications': general_notifications_schema.dump(notifications),
        'pagination': pagination_info
    }), 200

@notifications_bp.route('/general/<int:notification_id>', methods=['PUT'])
@user_token_required
@limiter.limit("30 per minute")
def update_general_notification(user_id, notification_id):
    """Update a general notification (mark as read/unread) - own notifications only"""
    notification = db.session.execute(
        select(GeneralNotification).where(
            and_(
                GeneralNotification.notification_id == notification_id,
                GeneralNotification.user_id == user_id
            )
        )
    ).scalars().first()

    if not notification:
        return jsonify({'error': 'Notification not found'}), 404

    try:
        data = request.get_json()
        validated_data = general_notification_update_schema.load(data)
    except ValidationError as e:
        return jsonify({'errors': e.messages}), 400

    # Only allow updating read status for security
    if 'is_read' in validated_data:
        notification.is_read = validated_data['is_read']

    db.session.commit()

    return general_notification_schema.jsonify(notification), 200

@notifications_bp.route('/general/<int:notification_id>', methods=['DELETE'])
@user_token_required
@limiter.limit("10 per minute")
def delete_general_notification(user_id, notification_id):
    """Delete a general notification - own notifications only"""
    notification = db.session.execute(
        select(GeneralNotification).where(
            and_(
                GeneralNotification.notification_id == notification_id,
                GeneralNotification.user_id == user_id
            )
        )
    ).scalars().first()

    if not notification:
        return jsonify({'error': 'Notification not found'}), 404

    db.session.delete(notification)
    db.session.commit()

    return jsonify({'message': 'Notification deleted successfully'}), 200

@notifications_bp.route('/general/mark-all-read', methods=['PUT'])
@user_token_required
@limiter.limit("10 per minute")
def mark_all_notifications_read(user_id):
    """Mark all general notifications as read for the authenticated user"""
    db.session.execute(
        GeneralNotification.__table__.update()
        .where(GeneralNotification.user_id == user_id)
        .values(is_read=True)
    )
    db.session.commit()

    return jsonify({'message': 'All notifications marked as read'}), 200

@notifications_bp.route('/general/count', methods=['GET'])
@user_token_required
def get_notification_count(user_id):
    """Get count of unread notifications for the authenticated user"""
    unread_count = db.session.execute(
        select(func.count(GeneralNotification.notification_id))
        .where(
            and_(
                GeneralNotification.user_id == user_id,
                GeneralNotification.is_read == False
            )
        )
    ).scalar()

    return jsonify({'unread_count': unread_count}), 200

# ========================================
# AUTHENTICATED USER ROUTES - DELIVERY NOTIFICATIONS
# ========================================

@notifications_bp.route('/delivery', methods=['GET'])
@user_token_required
def get_delivery_notifications(user_id):
    """Get all delivery notifications for the authenticated user"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 100)
    notification_type = request.args.get('type')

    query = select(DeliveryNotification).where(DeliveryNotification.user_id == user_id)
    
    if notification_type:
        query = query.where(DeliveryNotification.type == notification_type)
    
    query = query.order_by(desc(DeliveryNotification.sent_at))

    # Get total count
    total_query = select(func.count(DeliveryNotification.delivery_notification_id)).where(
        DeliveryNotification.user_id == user_id
    )
    if notification_type:
        total_query = total_query.where(DeliveryNotification.type == notification_type)

    total = db.session.execute(total_query).scalar()

    # Apply pagination
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    notifications = db.session.execute(query).scalars().all()

    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }

    return jsonify({
        'delivery_notifications': delivery_notifications_schema.dump(notifications),
        'pagination': pagination_info
    }), 200

@notifications_bp.route('/delivery/<int:notification_id>', methods=['DELETE'])
@user_token_required
@limiter.limit("10 per minute")
def delete_delivery_notification(user_id, notification_id):
    """Delete a delivery notification - own notifications only"""
    notification = db.session.execute(
        select(DeliveryNotification).where(
            and_(
                DeliveryNotification.delivery_notification_id == notification_id,
                DeliveryNotification.user_id == user_id
            )
        )
    ).scalars().first()

    if not notification:
        return jsonify({'error': 'Delivery notification not found'}), 404

    db.session.delete(notification)
    db.session.commit()

    return jsonify({'message': 'Delivery notification deleted successfully'}), 200

# ========================================
# ADMIN-ONLY ROUTES
# ========================================

@notifications_bp.route('/general', methods=['POST'])
@admin_token_required
@limiter.limit("20 per minute")
def create_general_notification(user_id):
    """Admin: Create a new general notification for any user"""
    try:
        data = request.get_json()
        validated_data = general_notification_create_schema.load(data)
    except ValidationError as e:
        return jsonify({'errors': e.messages}), 400

    # Verify target user exists
    target_user = db.session.execute(
        select(User).where(User.user_id == validated_data['user_id'])
    ).scalars().first()

    if not target_user:
        return jsonify({'error': 'Target user not found'}), 404

    notification = GeneralNotification(
        message=validated_data['message'],
        user_id=validated_data['user_id'],
        created_at=datetime.utcnow()
    )

    db.session.add(notification)
    db.session.commit()

    return general_notification_schema.jsonify(notification), 201

@notifications_bp.route('/general/bulk', methods=['POST'])
@admin_token_required
@limiter.limit("5 per minute")
def create_bulk_notifications(user_id):
    """Admin: Create notifications for multiple users"""
    try:
        data = request.get_json()
        validated_data = bulk_notification_create_schema.load(data)
    except ValidationError as e:
        return jsonify({'errors': e.messages}), 400

    # Verify all target users exist
    target_users = db.session.execute(
        select(User).where(User.user_id.in_(validated_data['user_ids']))
    ).scalars().all()

    if len(target_users) != len(validated_data['user_ids']):
        return jsonify({'error': 'One or more target users not found'}), 404

    notifications = []
    for user_id_target in validated_data['user_ids']:
        notification = GeneralNotification(
            message=validated_data['message'],
            user_id=user_id_target,
            created_at=datetime.utcnow()
        )
        db.session.add(notification)
        notifications.append(notification)

    db.session.commit()

    return jsonify({
        'message': f'{len(notifications)} notifications created successfully',
        'notifications': general_notifications_schema.dump(notifications)
    }), 201

@notifications_bp.route('/delivery', methods=['POST'])
@admin_token_required
@limiter.limit("20 per minute")
def create_delivery_notification(user_id):
    """Admin: Create a new delivery notification"""
    try:
        data = request.get_json()
        validated_data = delivery_notification_create_schema.load(data)
    except ValidationError as e:
        return jsonify({'errors': e.messages}), 400

    # Verify target user exists
    target_user = db.session.execute(
        select(User).where(User.user_id == validated_data['user_id'])
    ).scalars().first()

    if not target_user:
        return jsonify({'error': 'Target user not found'}), 404

    # Verify delivery exists
    delivery = db.session.execute(
        select(Delivery).where(Delivery.delivery_id == validated_data['delivery_id'])
    ).scalars().first()

    if not delivery:
        return jsonify({'error': 'Delivery not found'}), 404

    notification = DeliveryNotification(
        message=validated_data['message'],
        type=validated_data['type'],
        user_id=validated_data['user_id'],
        delivery_id=validated_data['delivery_id'],
        sent_at=datetime.utcnow()
    )

    db.session.add(notification)
    db.session.commit()

    return delivery_notification_schema.jsonify(notification), 201

@notifications_bp.route('/admin/general', methods=['GET'])
@admin_token_required
def admin_get_all_general_notifications(user_id):
    """Admin: Get all general notifications with pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 50, type=int), 100)
    
    query = select(GeneralNotification).order_by(desc(GeneralNotification.created_at))
    total = db.session.execute(select(func.count(GeneralNotification.notification_id))).scalar()
    
    offset = (page - 1) * per_page
    notifications = db.session.execute(query.offset(offset).limit(per_page)).scalars().all()
    
    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }
    
    return jsonify({
        'notifications': general_notifications_schema.dump(notifications),
        'pagination': pagination_info
    }), 200

@notifications_bp.route('/admin/delivery', methods=['GET'])
@admin_token_required
def admin_get_all_delivery_notifications(user_id):
    """Admin: Get all delivery notifications with pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 50, type=int), 100)
    
    query = select(DeliveryNotification).order_by(desc(DeliveryNotification.sent_at))
    total = db.session.execute(select(func.count(DeliveryNotification.delivery_notification_id))).scalar()
    
    offset = (page - 1) * per_page
    notifications = db.session.execute(query.offset(offset).limit(per_page)).scalars().all()
    
    pagination_info = {
        'page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page,
        'has_prev': page > 1,
        'has_next': page * per_page < total
    }
    
    return jsonify({
        'delivery_notifications': delivery_notifications_schema.dump(notifications),
        'pagination': pagination_info
    }), 200