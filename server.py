import asyncio
import json
import os
import time
import hashlib
from decimal import Decimal
import psycopg2
import psycopg2.extras
from aiohttp import web, WSMsgType

# Read .env if available
ENV_PATH = os.path.join(os.path.dirname(__file__), '.env')
db_config = {
    'host': '35.154.217.223',
    'port': 5432,
    'dbname': 'ricebeename',
    'user': 'ricebeeuser',
    'password': 'ricebeepwd'
}

if os.path.exists(ENV_PATH):
    try:
        with open(ENV_PATH, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    k = k.strip()
                    v = v.strip()
                    if k == 'DB_HOST': db_config['host'] = v
                    elif k == 'DB_PORT': db_config['port'] = int(v)
                    elif k == 'DB_NAME': db_config['dbname'] = v
                    elif k == 'DB_USER': db_config['user'] = v
                    elif k == 'DB_PASSWORD': db_config['password'] = v
    except Exception as e:
        print(f"Error reading .env: {e}")

print(f"Initializing Ricebee PostgreSQL Bridge with DB: {db_config['dbname']}@{db_config['host']}:{db_config['port']}")

SETTINGS_FILE = os.path.join(os.path.dirname(__file__), 'settings.json')
DEFAULT_SETTINGS = {
    'enableTax': True,
    'cgstPercent': 2.5,
    'sgstPercent': 2.5,
    'hsnCode': '1006',
    'companyName': 'RICEBEE ENTERPRISES',
    'tagline': 'Wholesale Rice Mill & Retail Counter',
    'address': '1, 25, Naidu St, Kurinji Nagar, Ramapuram, Chennai - 600089',
    'phone': '090926 80809',
    'gstin': '33KMDPK6488K1ZD',
    'defaultPaymentMode': 'Cash',
    'enableRoundOff': True,
    'invoiceFooterNote': 'Thank you for your business! Rice once sold cannot be returned without original receipt.'
}

def load_settings():
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, 'r') as f:
                saved = json.load(f)
                return {**DEFAULT_SETTINGS, **saved}
        except Exception as e:
            print(f"Error loading settings: {e}")
    return DEFAULT_SETTINGS.copy()

def save_settings(new_settings):
    try:
        current = load_settings()
        current.update(new_settings)
        with open(SETTINGS_FILE, 'w') as f:
            json.dump(current, f, indent=2)
        return current
    except Exception as e:
        print(f"Error saving settings: {e}")
        return None

active_ws_clients = set()
last_stock_hash = None
last_orders_hash = None

def get_db_connection():
    return psycopg2.connect(
        host=db_config['host'],
        port=db_config['port'],
        dbname=db_config['dbname'],
        user=db_config['user'],
        password=db_config['password'],
        connect_timeout=5
    )

def fetch_stock_from_db():
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT id, rice_name, quantity, price_per_kg, brand, updated_at FROM stock ORDER BY id ASC")
            rows = cur.fetchall()
            stock_items = []
            for r in rows:
                stock_items.append({
                    'id': f"stk-{r['id']}",
                    'riceName': r['rice_name'],
                    'quantity': float(r['quantity'] if r['quantity'] is not None else 0),
                    'pricePerKg': float(r['price_per_kg'] if r['price_per_kg'] is not None else 0),
                    'brand': (r.get('brand') or '').strip()
                })
            return stock_items
    except Exception as e:
        print(f"Error fetching stock from DB: {e}")
        return []
    finally:
        if conn:
            conn.close()

def fetch_orders_from_db():
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM orders ORDER BY created_at DESC LIMIT 50")
            rows = cur.fetchall()
            orders = []
            for r in rows:
                orders.append({
                    'id': r['id'],
                    'orderNo': r['order_no'],
                    'orderType': r['order_type'],
                    'customerName': r['customer_name'],
                    'customerPhone': r['customer_phone'] or '',
                    'items': r['items'],
                    'totalQtyKg': float(r['total_weight'] if r['total_weight'] is not None else 0),
                    'subtotal': float(r['subtotal'] if r['subtotal'] is not None else 0),
                    'discount': float(r['discount'] if r['discount'] is not None else 0),
                    'grandTotal': float(r['grand_total'] if r['grand_total'] is not None else 0),
                    'paymentMode': r['payment_mode'],
                    'paymentStatus': r['payment_status'],
                    'syncStatus': r['sync_status'],
                    'createdAt': str(r['created_at'])
                })
            return orders
    except Exception as e:
        print(f"Error fetching orders from DB: {e}")
        return []
    finally:
        if conn:
            conn.close()

def save_order_to_db(order_data):
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            # 1. Insert order
            items_json = json.dumps(order_data.get('items', []))
            total_qty = float(order_data.get('totalQtyKg', 0))
            subtotal = float(order_data.get('subtotal', 0))
            discount = float(order_data.get('discount', 0))
            grand_total = float(order_data.get('grandTotal', 0))
            order_no = str(order_data.get('orderNo') or f"INV-{int(time.time()*1000)}")
            
            cur.execute("""
                INSERT INTO orders (
                    order_no, order_type, customer_name, customer_phone, items,
                    total_bags, total_weight, subtotal, discount, grand_total,
                    payment_mode, payment_status, sync_status, created_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (order_no) DO UPDATE SET
                    customer_name = EXCLUDED.customer_name,
                    items = EXCLUDED.items,
                    total_weight = EXCLUDED.total_weight,
                    subtotal = EXCLUDED.subtotal,
                    discount = EXCLUDED.discount,
                    grand_total = EXCLUDED.grand_total,
                    created_at = NOW()
            """, (
                order_no,
                order_data.get('orderType', 'offline'),
                order_data.get('customerName', 'Walk-in Customer'),
                order_data.get('customerPhone', ''),
                items_json,
                0,
                total_qty,
                subtotal,
                discount,
                grand_total,
                order_data.get('paymentMode', 'Cash'),
                order_data.get('paymentStatus', 'Paid'),
                'synced'
            ))

            # 2. Deduct quantities from stock in PostgreSQL
            for item in order_data.get('items', []):
                variety = item.get('variety', '').strip()
                qty = float(item.get('qtyKg', 0))
                if variety and qty > 0:
                    cur.execute("""
                        UPDATE stock
                        SET quantity = GREATEST(0, quantity - %s),
                            updated_at = NOW()
                        WHERE LOWER(rice_name) = LOWER(%s)
                    """, (qty, variety))
        
        conn.commit()
        return True
    except Exception as e:
        print(f"Error saving order: {e}")
        if conn:
            conn.rollback()
        return False
    finally:
        if conn:
            conn.close()

async def broadcast_ws(payload):
    if not active_ws_clients:
        return
    msg = json.dumps(payload)
    disconnected = set()
    for ws in list(active_ws_clients):
        try:
            await ws.send_str(msg)
        except Exception:
            disconnected.add(ws)
    for ws in disconnected:
        active_ws_clients.discard(ws)

# HTTP Endpoints
async def handle_get_stock(request):
    loop = asyncio.get_event_loop()
    stock = await loop.run_in_executor(None, fetch_stock_from_db)
    return web.json_response(stock, headers={'Access-Control-Allow-Origin': '*'})

async def handle_get_orders(request):
    loop = asyncio.get_event_loop()
    orders = await loop.run_in_executor(None, fetch_orders_from_db)
    return web.json_response(orders, headers={'Access-Control-Allow-Origin': '*'})

async def handle_create_order(request):
    try:
        body = await request.json()
        loop = asyncio.get_event_loop()
        success = await loop.run_in_executor(None, save_order_to_db, body)
        if success:
            # Immediately broadcast new stock
            updated_stock = await loop.run_in_executor(None, fetch_stock_from_db)
            await broadcast_ws({'type': 'STOCK_UPDATE', 'stock': updated_stock})
            return web.json_response({'success': True, 'message': 'Order saved & stock updated'}, headers={'Access-Control-Allow-Origin': '*'})
        else:
            return web.json_response({'success': False, 'error': 'Database error'}, status=500, headers={'Access-Control-Allow-Origin': '*'})
    except Exception as e:
        return web.json_response({'success': False, 'error': str(e)}, status=400, headers={'Access-Control-Allow-Origin': '*'})

async def handle_get_tables(request):
    def get_tables():
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor() as cur:
                cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name")
                return [r[0] for r in cur.fetchall()]
        except Exception as e:
            print(f"Error fetching tables: {e}")
            return []
        finally:
            if conn: conn.close()
    
    loop = asyncio.get_event_loop()
    tables = await loop.run_in_executor(None, get_tables)
    return web.json_response({'tables': tables}, headers={'Access-Control-Allow-Origin': '*'})

async def handle_get_settings(request):
    settings = load_settings()
    return web.json_response(settings, headers={'Access-Control-Allow-Origin': '*'})

async def handle_post_settings(request):
    try:
        body = await request.json()
        saved = save_settings(body)
        if saved:
            await broadcast_ws({'type': 'SETTINGS_UPDATE', 'settings': saved})
            return web.json_response({'success': True, 'settings': saved}, headers={'Access-Control-Allow-Origin': '*'})
        return web.json_response({'success': False, 'error': 'Failed to save settings'}, status=500, headers={'Access-Control-Allow-Origin': '*'})
    except Exception as e:
        return web.json_response({'success': False, 'error': str(e)}, status=400, headers={'Access-Control-Allow-Origin': '*'})

async def handle_options(request):
    return web.Response(
        headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    )

# WebSocket Handler (handles both ws://localhost:5000 and ws://localhost:5000/ws)
async def handle_websocket(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    active_ws_clients.add(ws)
    print(f"WebSocket client connected. Total clients: {len(active_ws_clients)}")

    # Send initial stock & settings immediately upon connection
    loop = asyncio.get_event_loop()
    initial_stock = await loop.run_in_executor(None, fetch_stock_from_db)
    await ws.send_str(json.dumps({'type': 'STOCK_UPDATE', 'stock': initial_stock}))
    await ws.send_str(json.dumps({'type': 'SETTINGS_UPDATE', 'settings': load_settings()}))

    try:
        async for msg in ws:
            if msg.type == WSMsgType.TEXT:
                try:
                    data = json.loads(msg.data)
                    if data.get('type') == 'PING':
                        await ws.send_str(json.dumps({'type': 'PONG'}))
                    elif data.get('type') == 'REFRESH_STOCK':
                        current_stock = await loop.run_in_executor(None, fetch_stock_from_db)
                        await ws.send_str(json.dumps({'type': 'STOCK_UPDATE', 'stock': current_stock}))
                except Exception:
                    pass
            elif msg.type == WSMsgType.ERROR:
                print(f"WebSocket error: {ws.exception()}")
    finally:
        active_ws_clients.discard(ws)
        print(f"WebSocket client disconnected. Total clients: {len(active_ws_clients)}")
    return ws

# Fast Database Change Poller (checks PostgreSQL every 1.0 second)
async def database_change_poller():
    global last_stock_hash, last_orders_hash
    loop = asyncio.get_event_loop()
    print("Started Fast PostgreSQL Realtime Poller (1.0s interval)")
    
    while True:
        try:
            # 1. Check stock
            stock = await loop.run_in_executor(None, fetch_stock_from_db)
            stock_json = json.dumps(stock, sort_keys=True)
            stock_hash = hashlib.md5(stock_json.encode('utf-8')).hexdigest()
            
            if last_stock_hash is not None and stock_hash != last_stock_hash:
                print(f"[LIVE PG] Stock table change detected! Broadcasting to {len(active_ws_clients)} clients...")
                await broadcast_ws({'type': 'STOCK_UPDATE', 'stock': stock})
            
            last_stock_hash = stock_hash

            # 2. Check orders
            orders = await loop.run_in_executor(None, fetch_orders_from_db)
            orders_json = json.dumps(orders, sort_keys=True)
            orders_hash = hashlib.md5(orders_json.encode('utf-8')).hexdigest()

            if last_orders_hash is not None and orders_hash != last_orders_hash:
                print(f"[LIVE PG] Orders table change detected! Broadcasting to {len(active_ws_clients)} clients...")
                await broadcast_ws({'type': 'ORDERS_UPDATE', 'orders': orders})

            last_orders_hash = orders_hash

        except Exception as e:
            print(f"Poller error: {e}")
        
        await asyncio.sleep(1.0)

async def start_background_tasks(app):
    app['poller_task'] = asyncio.create_task(database_change_poller())

async def cleanup_background_tasks(app):
    app['poller_task'].cancel()
    await app['poller_task']

def create_app():
    app = web.Application()
    
    # Routes
    app.router.add_options('/{tail:.*}', handle_options)
    app.router.add_get('/', handle_websocket)
    app.router.add_get('/ws', handle_websocket)
    app.router.add_get('/api/stock', handle_get_stock)
    app.router.add_get('/api/orders', handle_get_orders)
    app.router.add_post('/api/orders', handle_create_order)
    app.router.add_get('/api/tables', handle_get_tables)
    app.router.add_get('/api/settings', handle_get_settings)
    app.router.add_post('/api/settings', handle_post_settings)
    
    app.on_startup.append(start_background_tasks)
    app.on_cleanup.append(cleanup_background_tasks)
    return app

if __name__ == '__main__':
    app = create_app()
    print("Serving Ricebee PostgreSQL Real-Time Bridge on http://localhost:5000 and ws://localhost:5000")
    web.run_app(app, host='0.0.0.0', port=5000)
