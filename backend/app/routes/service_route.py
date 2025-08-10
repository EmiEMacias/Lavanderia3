from flask import jsonify, request, Blueprint
from app.controllers.service_controller import create_service, update_service, delete_service, get_services
service_bp = Blueprint("service_bp", __name__, url_prefix="/services")

@service_bp.route("/create", methods=["POST"])
def create():
    data = request.json
    service = create_service(data["name"], data["description"], data["price"])
    return jsonify({"msg":"Servicio Creado con exito", "service_id":service.id}),200

@service_bp.route("/update/<int:service_id>", methods=["PUT"])
def update(service_id):
    data = request.json
    service = update_service(service_id, data)
    return jsonify({"msg":"Servicio actualizado con exito", "service_id":service.id}),200

@service_bp.route("/delete/<int:service_id>", methods=["DELETE"])
def delete(service_id):
    delete_service(service_id)
    return jsonify({"msg":"Servicio eliminado con exito"}),200

@service_bp.route("/get-all", methods=["GET"])
def get_all():
    services = get_services()
    return jsonify({"msg":"Listado de servicios se ejecuto con exito", "services":services}),200