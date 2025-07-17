from flask import request, jsonify
from sqlalchemy import select, and_, or_, func, desc
from marshmallow import ValidationError
from app.models import Message, User, db
# from app.blueprints.messaging.schemas import message_schema, messages_schema, message_create_schema
from app.blueprints.messaging import messaging_bp
from app.utils.util import user_token_required
from app.extensions import limiter
from datetime import datetime


@messaging_bp.route('/conversations', methods=['GET'])
@user_token_required
def get_conversations(current_user):
    """Get all conversations for the current user"""
    try:
        # Get conversations by finding messages where current user is sender or receiver
        # Group by the other participant to create conversation threads
        conversations_query = db.session.query(
            func.max(Message.message_id).label('latest_message_id'),
            func.case(
                (Message.sender_id == current_user.user_id, Message.receiver_id),
                else_=Message.sender_id
            ).label('other_user_id')
        ).filter(
            or_(
                Message.sender_id == current_user.user_id,
                Message.receiver_id == current_user.user_id
            )
        ).group_by('other_user_id').all()

        conversations = []
        for conv in conversations_query:
            # Get the latest message
            latest_message = db.session.get(Message, conv.latest_message_id)
            # Get the other user
            other_user = db.session.get(User, conv.other_user_id)
            
            if latest_message and other_user:
                # Create conversation ID using sorted user IDs for consistency
                user_ids = sorted([current_user.user_id, other_user.user_id])
                conversation_id = f"conv_{user_ids[0]}_{user_ids[1]}"
                
                conversations.append({
                    'id': conversation_id,
                    'participant': {
                        'id': str(other_user.user_id),
                        'name': f"{other_user.first_name} {other_user.last_name}".strip() or other_user.email,
                        'avatar': 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'  # TODO: Use actual avatar
                    },
                    'lastMessage': {
                        'text': latest_message.content,
                        'timestamp': int(latest_message.sent_at.timestamp() * 1000),
                        'unread': latest_message.sender_id != current_user.user_id  # Simple unread logic
                    },
                    'item': {
                        'id': '1',  # TODO: Link to actual listing if available
                        'title': 'Item Discussion',
                        'status': 'active'
                    }
                })

        return jsonify({'conversations': conversations}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch conversations', 'details': str(e)}), 500


@messaging_bp.route('/<conversation_id>', methods=['GET'])
@user_token_required
def get_messages(current_user, conversation_id):
    """Get all messages in a conversation"""
    try:
        # Extract user IDs from conversation_id (format: conv_1_2)
        if not conversation_id.startswith('conv_'):
            return jsonify({'error': 'Invalid conversation ID format'}), 400
        
        try:
            user_ids = conversation_id.replace('conv_', '').split('_')
            user1_id, user2_id = int(user_ids[0]), int(user_ids[1])
        except (ValueError, IndexError):
            return jsonify({'error': 'Invalid conversation ID format'}), 400
        
        # Verify current user is part of this conversation
        if current_user.user_id not in [user1_id, user2_id]:
            return jsonify({'error': 'Access denied to this conversation'}), 403
        
        # Get all messages between these two users
        messages_query = select(Message).where(
            or_(
                and_(Message.sender_id == user1_id, Message.receiver_id == user2_id),
                and_(Message.sender_id == user2_id, Message.receiver_id == user1_id)
            )
        ).order_by(Message.sent_at)
        
        messages = db.session.execute(messages_query).scalars().all()
        
        formatted_messages = []
        for msg in messages:
            formatted_messages.append({
                'id': f"msg_{msg.message_id}",
                'text': msg.content,
                'sender': 'user' if msg.sender_id == current_user.user_id else 'other',
                'timestamp': int(msg.sent_at.timestamp() * 1000)
            })
        
        return jsonify({'messages': formatted_messages}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch messages', 'details': str(e)}), 500


@messaging_bp.route('/<conversation_id>', methods=['POST'])
@user_token_required
@limiter.limit('30 per minute')
def send_message(current_user, conversation_id):
    """Send a message in a conversation"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Message text is required'}), 400
        
        message_text = data['text'].strip()
        if not message_text:
            return jsonify({'error': 'Message text cannot be empty'}), 400
        
        # Extract user IDs from conversation_id
        if not conversation_id.startswith('conv_'):
            return jsonify({'error': 'Invalid conversation ID format'}), 400
        
        try:
            user_ids = conversation_id.replace('conv_', '').split('_')
            user1_id, user2_id = int(user_ids[0]), int(user_ids[1])
        except (ValueError, IndexError):
            return jsonify({'error': 'Invalid conversation ID format'}), 400
        
        # Verify current user is part of this conversation
        if current_user.user_id not in [user1_id, user2_id]:
            return jsonify({'error': 'Access denied to this conversation'}), 403
        
        # Determine receiver (the other user in the conversation)
        receiver_id = user2_id if current_user.user_id == user1_id else user1_id
        
        # Verify receiver exists
        receiver = db.session.get(User, receiver_id)
        if not receiver:
            return jsonify({'error': 'Receiver not found'}), 404
        
        # Create new message
        new_message = Message(
            content=message_text,
            sender_id=current_user.user_id,
            receiver_id=receiver_id,
            sent_at=datetime.utcnow()
        )
        
        db.session.add(new_message)
        db.session.commit()
        
        return jsonify({
            'id': f"msg_{new_message.message_id}",
            'text': message_text,
            'timestamp': int(new_message.sent_at.timestamp() * 1000),
            'sender': 'user'
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to send message', 'details': str(e)}), 500


@messaging_bp.route('/conversation/<int:user_id>', methods=['POST'])
@user_token_required
def start_conversation(current_user, user_id):
    """Start a new conversation with another user"""
    try:
        # Verify the other user exists
        other_user = db.session.get(User, user_id)
        if not other_user:
            return jsonify({'error': 'User not found'}), 404
        
        if user_id == current_user.user_id:
            return jsonify({'error': 'Cannot start conversation with yourself'}), 400
        
        # Create conversation ID
        user_ids = sorted([current_user.user_id, user_id])
        conversation_id = f"conv_{user_ids[0]}_{user_ids[1]}"
        
        return jsonify({
            'conversation_id': conversation_id,
            'participant': {
                'id': str(other_user.user_id),
                'name': f"{other_user.first_name} {other_user.last_name}".strip() or other_user.email,
                'avatar': 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg'
            }
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to start conversation', 'details': str(e)}), 500
