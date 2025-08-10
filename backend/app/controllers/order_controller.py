from app.database.db import db
from app.models.order import Order
from app.models.garment import Garment
from app.models.order_detail import OrderDetail
from app.models.service import Service
from app.models.client import Client
from app.models.user import User

def create_order(client_id, user_id, estimated_date, total_price):
    order = Order(client_id=client_id, user_id=user_id, estimated_delivery_date= estimated_date, total=total_price)
    db.session.add(order)
    db.session.commit()
    return order

def add_service(name, description, price):
    service = Service(name=name, description=description, price=price)
    db.session.add(service)
    db.session.commit()
    return service

def add_garment(order_id, type, description, notes):
    garment = Garment(order_id=order_id, type=type, description=description, observations=notes)
    db.session.add(garment)
    db.session.commit()
    return garment

def create_order_detail(garment_id, service_id, quantity):
    order_detail = OrderDetail(garment_id=garment_id, service_id=service_id, quantity=quantity)
    db.session.add(order_detail)
    db.session.commit()
    return order_detail

def get_order_detail(order_id):
    #La busqueda que haremos debe traer:
    #Cliente, garments
    #Cada garment debe tener sus services
    order = Order.query.get(order_id)
    order_data = {
        "order_id":order.id,
        "client":order.clients.name,
        "status":order.state,
        "garments":[]
    }
    garments = Garment.query.filter_by(order_id=order.id)
    
    for garment in garments:
        garment_data = {
            "type":garment.type,
            "description":garment.description,
            "observations":garment.observations,
            "services":[]
        }
        for gs in garment.order_detail:
            service = Service.query.get(gs.service_id)
            service_data = {
                "name":service.name,
                "description":service.description,
                "price":service.price
            }
            garment_data["services"].append(service_data)
        order_data["garments"].append(garment_data)
    return order_data
    
def update_order_status(order_id, new_status):
    order = Order.query.get(order_id)
    if not order:
        return None
    order.state = new_status
    db.session.commit()
    return order

def list_orders_by_status(status):
    orders = Order.query.filter_by(state=status).all()
    data = [{
        "id":order.id,
        "client_id":order.client_id,
        "state":order.state,
        "estimated_delivery_date":order.estimated_delivery_date,
        "total":order.total,
        "pagado":order.pagado,
    } for order in orders]
    return data

def create_order_table(orders):
    data = []
    for order in orders:
        client = Client.query.get(order.client_id)
        user = User.query.get(order.user_id)
        order_table = {
            "id":order.id,
            "client_name":client.name,
            "user_name":user.name,
            "state":order.state,
            "created_at":order.created_at,
            "total":order.total,
        }
        data.append(order_table)
    return data

def get_orders_dashboard(pagination):
    orders = Order.query.filter().order_by(Order.created_at.desc()).limit(10)
    if pagination > 1:
        orders = orders.offset(pagination*10)
    return create_order_table(orders.all())

def get_pending_orders_dashboard(pagination):
    orders_received = Order.query.filter_by(state="recibido").order_by(Order.created_at.desc()).limit(10)
    orders_process = Order.query.filter_by(state="en proceso").order_by(Order.created_at.desc()).limit(10)
    if pagination > 1:
        orders_received = orders_received.offset(pagination*10)
        orders_process = orders_process.offset(pagination*10)
    orders = orders_process.all() + orders_received.all()
    return create_order_table(orders)

def get_counting():
    num_garments = Garment.query.filter().count()
    num_services = Service.query.filter().count()
    num_clients = Client.query.filter().count()
    num_users = User.query.filter().count()
    data = {
        "quantity_garments":num_garments,
        "quantity_services":num_services,
        "quantity_users":num_users,
        "quantity_clients":num_clients
    }
    return data
