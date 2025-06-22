from .schemas import role_schema, roles_schema
from flask import request, jsonify
from sqlalchemy import select
from app.models import Role, db
from . import roles_bp

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ROLE ROUTES xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

@roles_bp.route("", methods=["POST"])  # <------------------------------------------ CREATE ROLE ROUTE
def create_role():
    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"error": "Role name is required"}), 400

    existing = db.session.execute(select(Role).where(Role.name == name)).scalars().first()
    if existing:
        return jsonify({"error": "Role already exists"}), 400

    new_role = Role(name=name)
    db.session.add(new_role)
    db.session.commit()
    return role_schema.jsonify(new_role), 201

@roles_bp.route("", methods=["GET"])  # <------------------------------------------ GET ALL ROLES ROUTE
def get_roles():
    roles = db.session.execute(select(Role)).scalars().all()
    return roles_schema.jsonify(roles), 200

@roles_bp.route("/<int:role_id>", methods=["GET"])  # <------------------------------------------ GET ROLE BY ID ROUTE
def get_role(role_id):
    role = db.session.execute(select(Role).where(Role.role_id == role_id)).scalars().first()
    if not role:
        return jsonify({"error": "Role not found"}), 404
    return role_schema.jsonify(role), 200

@roles_bp.route("/<int:role_id>", methods=["PUT"])  # <------------------------------------------ UPDATE ROlE ROUTE
def update_role(role_id):
    role = db.session.execute(select(Role).where(Role.role_id == role_id)).scalars().first()
    if not role:
        return jsonify({"error": "Role not found"}), 404

    data = request.get_json()
    new_name = data.get("name")

    if not new_name:
        return jsonify({"error": "New role name is required"}), 400

    existing = db.session.execute(
        select(Role).where(Role.name == new_name, Role.role_id != role_id)
    ).scalars().first()
    if existing:
        return jsonify({"error": "Role name already exists"}), 400

    role.name = new_name
    db.session.commit()
    return role_schema.jsonify(role), 200

@roles_bp.route("/<int:role_id>", methods=["DELETE"])  # <------------------------------------------ DELETE ROLE ROUTE
def delete_role(role_id):
    role = db.session.execute(select(Role).where(Role.role_id == role_id)).scalars().first()
    if not role:
        return jsonify({"error": "Role not found"}), 404

    db.session.delete(role)
    db.session.commit()
    return jsonify({"message": f"Role '{role.name}' deleted successfully"}), 200