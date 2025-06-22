from app.extensions import ma
from app.models import Role

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ROLE Schemas xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

class RoleSchema(ma.SQLAlchemyAutoSchema):  # <------------------------------------------ Role Schema
    class Meta:
        model = Role
        load_instance = True

role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)