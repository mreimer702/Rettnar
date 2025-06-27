from flask import request, jsonify
from sqlalchemy import select, update
from marshmallow import ValidationError

from app.models import Image, Listing, db
from app.blueprints.listing_images.schemas import (
    image_schema,
    images_schema,
    image_create_schema,
    image_update_schema,
    bulk_image_create_schema
)
from app.blueprints.listing_images import listing_images_bp
from app.utils.util import user_token_required
from app.extensions import limiter

@listing_images_bp.route('/listing/<int:listing_id>/images', methods=['POST'])
@user_token_required
@limiter.limit("10 per minute")
def add_images_to_listing(user_id, listing_id):

    listing = db.session.execute(
        select(Listing).where(Listing.id == listing_id)
    ).scalars().first()

    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    
    if listing.owner_id != user_id:
        return jsonify({"error": "You do not have permission to add images to this listing"}), 403
    
    try:
        data = request.get_json()
        validated_data = image_create_schema.load(data)
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400
    
    is_primary = validated_data.get('is_primary', False)

    if is_primary:
        db.session.execute(
            update(Image)
            .where(Image.listing_id == listing_id)
            .values(is_primary=False)
        )

    existing_images_count = db.session.execute(
        select(db.func.count(Image.image_id))
        .where(Image.listing_id == listing_id)
    ).scalar()

    if existing_images_count == 0:
        is_primary = True

    image = Image(
        url=validated_data['url'],
        is_primary=is_primary,
        listing_id=listing_id
    )

    db.session.add(image)
    db.session.commit()

    return image_schema.jsonify(image), 201

@listing_images_bp.route('/listing/<int:listing_id>/images/bulk', methods=['POST'])
@user_token_required
@limiter.limit("10 per minute")
def add_bulk_images_to_listing(user_id, listing_id):

    listing = db.session.execute(
        select(Listing).where(Listing.id == listing_id)
    ).scalars().first()

    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    
    if listing.owner_id != user_id:
        return jsonify({"error": "You do not have permission to add images to this listing"}), 403
    
    try:
        data = request.get_json()
        validated_data = bulk_image_create_schema.load(data)
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400
    
    images_data = validated_data['images']

    primary_images = [img for  img in images_data if img.get('is_primary', False)]

    if len(primary_images) > 1:
        for img in primary_images[1:]:
            img['is_primary'] = False

    if primary_images:
        db.session.execute(
            update(Image)
            .where(Image.listing_id == listing_id)
            .values(is_primary=False)
        )

    existing_primary = db.session.execute(
        select(Image)
        .where(Image.listing_id == listing_id, Image.is_primary == True)
    ).scalars().first()

    if not existing_primary and primary_images and images_data:
        images_data[0]['is_primary'] = True

    created_images = []
    for img_data in images_data:
        image = Image(
            url=img_data['url'],
            is_primary=img_data.get('is_primary', False),
            listing_id=listing_id
        )
        db.session.add(image)
        created_images.append(image)

    db.session.commit()

    return jsonify({
        'message': f'{len(created_images)} images added successfully',
        'images': images_schema.dump(created_images)
    }), 201

@listing_images_bp.route('/listing/<int:listing_id>/images', methods=['GET'])
def get_listing_images(listing_id):
    listing = db.session.execute(
        select(Listing).where(Listing.id == listing_id)
    ).scalars().first()

    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    
    images = db.session.execute(
        select(Image)
        .where(Image.listing_id == listing_id)
        .order_by(Image.is_primary.desc(), Image.image_id.asc())
    ).scalars().all()

    return images_schema.jsonify(images), 200

@listing_images_bp.route('/images/<int:image_id>', methods=['GET'])
def get_image(image_id):
    image = db.session.execute(
        select(Image).where(Image.image_id == image_id)
    ).scalars().first()

    if not image:
        return jsonify({"error": "Image not found"}), 404

    return image_schema.jsonify(image), 200

@listing_images_bp.route('/images/<int:image_id>', methods=['PUT'])
@user_token_required
@limiter.limit("10 per minute")
def update_image(user_id, image_id):
    image = db.session.execute(
        select(Image).where(Image.image_id == image_id)
    ).scalars().first()

    if not image:
        return jsonify({"error": "Image not found"}), 404

    listing = db.session.execute(
        select(Listing).where(Listing.id == image.listing_id)
    ).scalars().first()

    if listing.owner_id != user_id:
        return jsonify({"error": "You do not have permission to update this image"}), 403

    try:
        data = request.get_json()
        validated_data = image_update_schema.load(data)
    except ValidationError as e:
        return jsonify({"errors": e.messages}), 400

    if 'url' in validated_data:
        image.url = validated_data['url']

    if 'is_primary' in validated_data:
        new_is_primary = validated_data['is_primary']

        if new_is_primary and not image.is_primary:
            db.session.execute(
                update(Image)
                .where(Image.listing_id == image.listing_id, Image.image_id != image_id)
                .values(is_primary=False)
            )
        
        image.is_primary = new_is_primary

    if not new_is_primary and image.is_primary:
        other_images = db.session.execute(
            select(Image)
            .where(Image.listing_id == image.listing_id, Image.image_id != image_id)
            .limit(1)
        ).scalars().all()

        if other_images:
            other_images.is_primary = True

    db.session.commit()
    return image_schema.jsonify(image), 200

@listing_images_bp.route('/images/<int:image_id>', methods=['DELETE'])
@user_token_required
@limiter.limit("10 per minute")
def delete_image(user_id, image_id):

    image = db.session.execute(
        select(Image).where(Image.image_id == image_id)
    ).scalars().first()

    if not image:
        return jsonify({"error": "Image not found"}), 404
    
    listing = db.session.execute(
        select(Listing).where(Listing.id == image.listing_id)
    ).scalars().first()

    if listing.owner_id != user_id:
        return jsonify({"error": "You do not have permission to delete this image"}), 403
    
    listing_id = image.listing_id
    was_primary = image.is_primary

    db.session.delete(image)

    if was_primary:
        other_image = db.session.execute(
            select(Image)
            .where(Image.listing_id == listing_id)
            .limit(1)
        ).scalars().all()

        if other_image:
            other_image.is_primary = True

    db.session.commit()
    return jsonify({"message": "Image deleted successfully"}), 200

@listing_images_bp.route('/images/<int:image_id>/set-primary', methods=['PUT'])
@user_token_required
@limiter.limit("10 per minute")
def set_primary_image(user_id, image_id):

    image = db.session.execute(
        select(Image).where(Image.image_id == image_id)
    ).scalars().first()

    if not image:
        return jsonify({"error": "Image not found"}), 404
    
    listing = db.session.execute(
        select(Listing).where(Listing.id == image.listing_id)
    ).scalars().first()

    if listing.owner_id != user_id:
        return jsonify({"error": "You do not have permission to set this image as primary"}), 403
    
    db.session.execute(
        update(Image)
        .where(Image.listing_id == image.listing_id)
        .values(is_primary=False)
    )

    image.is_primary = True
    db.session.commit()

    return image_schema.jsonify(image), 200

@listing_images_bp.route('/images/<int:listing_id>/images/reorder', methods=['PUT'])
@user_token_required
@limiter.limit("10 per minute")
def reorder_images(user_id, listing_id):

    listing = db.session.execute(
        select(Listing).where(Listing.id == listing_id)
    ).scalars().first()

    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    
    if listing.owner_id != user_id:
        return jsonify({"error": "You do not have permission to reorder images for this listing"}), 403
    
    try:
        data = request.get_json()
        image_ids = data.get('image_ids', [])

        if not isinstance(image_ids, list):
            return jsonify({"error": "image_ids must be a list"}), 400
        
        existing_images = db.session.execute(
            select(Image).where(Image.listing_id == listing_id)
        ).scalars().all()

        existing_image_ids = {img.image_id for img in existing_images}
        provided_image_ids = set(image_ids)

        if provided_image_ids != existing_image_ids:
            return jsonify({"error": "Provided image IDs do not match existing images for this listing"}), 400
        
        return jsonify({"message": "Image order updated successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": "Invalid request data"}), 400