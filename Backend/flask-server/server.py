from flask import Flask, request, jsonify
from flask_cors import CORS
import networkx as nx
import heapq 
import requests

app = Flask(__name__)
CORS(app)

# Rute endpoint untuk '/members' dengan method HTTP 'POST'
@app.route('/members', methods=['POST'])

# Fungsi ini akan menghandle endpoint '/members' 
def members():
    # Mendapatkan data dari frontend
    data = request.get_json()
    origin = data.get('origin')
    destination = data.get('destination')

    # Memanggil fungsi astar untuk mendapatkan hasil dari input frontend
    answer = astar(origin, destination)
    
    # Mengatur data yang akan di fetch dan meng-fetch data tersebut ke frontend
    response_data = {"origin": origin, "destination": destination, "answer": answer} 
    response = {"success": True, "data": response_data, "message": "Request processed successfully"}
    return response

# Fungsi untuk melakukan pencarian a* untuk mendapatkan jalur tercepat dan biaya termurah
def astar_search(graph, start, goal, heuristic, weightType):

    # Pendefinisian Variabel-variabel
    visited = set()
    heap = [(heuristic(start), start, 0, "")]
    costs = {start: 0}
    parents = {}

    # Perulangan untuk melakukan graph traversing
    while heap:
        (f, current_node, cost, name) = heapq.heappop(heap)
        if current_node in visited:
            continue
        visited.add(current_node)
        if current_node == goal:
            fixed_path = []
            node = goal

            # Melakukan backtracking ketika rute berhasil ditemukan
            while node != start:
                fixed_path.append((node, costs[node], parents[node][2], parents[node][3], parents[node][4]))
                node = parents[node][0]
            fixed_path.append((start, 0, "", [0,0], [0,0]))
            fixed_path.reverse()
            return True, costs[goal], fixed_path
        
        # Perulangan untuk mengunjungi node - node tetangga
        for neighbor in graph.neighbors(current_node):
            if neighbor not in visited:
                for edge in graph[current_node][neighbor].values():
                    new_cost = edge[weightType] + cost
                    bus_name = edge.get('bus_name')
                    neighbor_ori_coords =  edge.get('origin_coords')
                    neighbor_dest_coords =  edge.get('dest_coords')
                    if neighbor not in costs or new_cost < costs[neighbor]:
                        costs[neighbor] = new_cost
                        parents[neighbor] = (current_node, new_cost, bus_name, neighbor_ori_coords, neighbor_dest_coords)
                        heapq.heappush(heap, (new_cost + heuristic(neighbor), neighbor, new_cost, bus_name))
                        
    return False, None, None

# Fungsi ini melakukan hal sebagai berikut:
# membuat graph (menyimpan data kota beserta rute busnya)
# menyimpan data heuristik
# memanggil fungsi astar_search untuk mendapatkan hasil pencarian a*
def astar(asal, tujuan):

    # Membuat sebuah graph

    graph = nx.MultiGraph()

    edges = [
        ('Serang', 'Jakarta Pusat', {'cost_weight': 83, 'bus_name': 'bus Andara', 'time_weight': 78, 'origin_coords': (-6.109918118031118,106.1422995381122), 'dest_coords': ( -6.170238459973355, 106.84270678401491)}),
        ('Serang', 'Jakarta Pusat', {'cost_weight': 74, 'bus_name': 'bus Endhog', 'time_weight': 85, 'origin_coords': (-6.109918118031118,106.1422995381122), 'dest_coords': ( -6.170238459973355, 106.84270678401491)}),
        ('Serang', 'Jakarta Pusat', {'cost_weight': 65, 'bus_name': 'bus Mamanur', 'time_weight': 88, 'origin_coords': (-6.109918118031118,106.1422995381122), 'dest_coords': ( -6.170238459973355, 106.84270678401491)}),
        ('Jakarta Pusat', 'Bandung', {'cost_weight': 80, 'bus_name': 'bus Endhog', 'time_weight': 145, 'origin_coords': ( -6.170238459973355, 106.84270678401491), 'dest_coords': (-6.913677130043071, 107.60203239958584)}),
        ('Jakarta Pusat', 'Bandung', {'cost_weight': 89, 'bus_name': 'bus Mamanur', 'time_weight': 152, 'origin_coords': ( -6.170238459973355, 106.84270678401491), 'dest_coords': (-6.913677130043071, 107.60203239958584)}),
        ('Bandung', 'Semarang', {'cost_weight': 370, 'bus_name': 'bus Buslebew', 'time_weight': 313, 'origin_coords': (-6.913677130043071, 107.60203239958584), 'dest_coords': (-7.0291435858578195, 110.41763151518792)}),
        ('Bandung', 'Semarang', {'cost_weight': 352, 'bus_name': 'bus Fateh', 'time_weight': 320, 'origin_coords': (-6.913677130043071, 107.60203239958584), 'dest_coords': (-7.0291435858578195, 110.41763151518792)}),
        ('Bandung', 'Yogyakarta', {'cost_weight': 396, 'bus_name': 'bus Mamanur', 'time_weight': 442, 'origin_coords': (-6.913677130043071, 107.60203239958584), 'dest_coords': (-7.829349701804929, 110.39203413599496)}),
        ('Semarang', 'Surabaya', {'cost_weight': 350, 'bus_name': 'bus Chuaks', 'time_weight': 257, 'origin_coords': (-7.0291435858578195, 110.41763151518792), 'dest_coords': (-7.302544723479081, 112.73783663618134)}),
        ('Semarang', 'Surabaya', {'cost_weight': 332, 'bus_name': 'bus Fateh', 'time_weight': 264, 'origin_coords': (-7.0291435858578195, 110.41763151518792), 'dest_coords': (-7.302544723479081, 112.73783663618134)}),
        ('Yogyakarta', 'Surabaya', {'cost_weight': 325, 'bus_name': 'bus Dirdor', 'time_weight': 295, 'origin_coords': (-7.829349701804929, 110.39203413599496), 'dest_coords': (-7.302544723479081, 112.73783663618134)}),
        ('Serang', 'Bandung', {'cost_weight': 230, 'bus_name': 'bus Gadda', 'time_weight': 232, 'origin_coords': (-6.109918118031118,106.1422995381122), 'dest_coords': (-6.913677130043071, 107.60203239958584)}),
        ('Serang', 'Yogyakarta', {'cost_weight': 641, 'bus_name': 'bus Halilintar', 'time_weight': 555, 'origin_coords': (-6.109918118031118,106.1422995381122), 'dest_coords': (-7.829349701804929, 110.39203413599496)}),
        ('Jakarta Pusat', 'Surabaya', {'cost_weight': 786, 'bus_name': 'bus Ijimayo', 'time_weight': 575, 'origin_coords': ( -6.170238459973355, 106.84270678401491), 'dest_coords': (-7.302544723479081, 112.73783663618134)}),
        ('Jakarta Pusat', 'Semarang', {'cost_weight': 445, 'bus_name': 'bus Jamila', 'time_weight': 332 , 'origin_coords': ( -6.170238459973355, 106.84270678401491), 'dest_coords': (-7.0291435858578195, 110.41763151518792)}),
        ('Bandung', 'Surabaya', {'cost_weight': 711, 'bus_name': 'bus Katete', 'time_weight': 568, 'origin_coords': (-6.913677130043071, 107.60203239958584), 'dest_coords': (-7.302544723479081, 112.73783663618134)}),
        ('Semarang', 'Yogyakarta', {'cost_weight': 130, 'bus_name': 'bus Lontar', 'time_weight': 165, 'origin_coords': (-7.0291435858578195, 110.41763151518792), 'dest_coords': (-7.829349701804929, 110.39203413599496)}),
    ]

    graph.add_edges_from([(u, v, d) for (u, v, d) in edges])

    # Mendefinisikan nilai heuristik

    Serang_heuristic_distance = {
        'Surabaya' : 800,
        'Semarang' : 493,
        'Bandung' : 140,
        'Serang' : 0,
        'Jakarta Pusat' : 60,
        'Yogyakarta' : 537,
    }

    Serang_heuristic_time = {
        'Serang' : 0,
        'Jakarta Pusat' : 70,
        'Bandung' : 210,
        'Semarang' : 400,
        'Yogyakarta' : 545,
        'Surabaya' : 650,
    }

    JakartaPusat_heuristic_distance = {
        'Serang' : 60,
        'Jakarta Pusat' : 0,
        'Bandung' : 75,
        'Semarang' : 426,
        'Yogyakarta' : 465,
        'Surabaya' : 752,
    }

    JakartaPusat_heuristic_time = {
        'Serang' : 70,
        'Jakarta Pusat' : 0,
        'Bandung' : 139,
        'Semarang' : 325,
        'Yogyakarta' : 490,
        'Surabaya' : 570,
    }

    Bandung_heuristic_distance = {
        'Serang' : 140,
        'Jakarta Pusat' : 75,
        'Bandung' : 0,
        'Semarang' : 345,
        'Yogyakarta' : 390,
        'Surabaya' : 676,
    }

    Bandung_heuristic_time = {
        'Serang' : 210,
        'Jakarta Pusat' : 139,
        'Bandung' : 0,
        'Semarang' : 308,
        'Yogyakarta' : 435,
        'Surabaya' : 560,
    }

    Semarang_heuristic_distance = {
        'Serang' : 493,
        'Jakarta Pusat' : 426,
        'Bandung' : 345,
        'Semarang' : 0,
        'Yogyakarta' : 125,
        'Surabaya' : 324,
    }

    Semarang_heuristic_time = {
        'Serang' : 400,
        'Jakarta Pusat' : 325,
        'Bandung' : 308,
        'Semarang' : 0,
        'Yogyakarta' : 159,
        'Surabaya' : 252,
    }

    Jogja_heuristic_distance = {
        'Serang' : 537,
        'Jakarta Pusat' : 465,
        'Bandung' : 390,
        'Semarang' : 125,
        'Yogyakarta' : 0,
        'Surabaya' : 316,
    }

    Jogja_heuristic_time = {
        'Serang' : 545,
        'Jakarta Pusat' : 490,
        'Bandung' : 435,
        'Semarang' : 159,
        'Yogyakarta' : 0,
        'Surabaya' : 287,
    }

    Surabaya_heuristic_distance = {
        'Serang' : 800,
        'Jakarta Pusat' : 752,
        'Bandung' : 676,
        'Semarang' : 324,
        'Yogyakarta' : 316,
        'Surabaya' : 0,
    }

    Surabaya_heuristic_time = {
        'Serang' : 650,
        'Jakarta Pusat' : 570,
        'Bandung' : 560,
        'Semarang' : 252,
        'Yogyakarta' : 287,
        'Surabaya' : 0,
    }

    heuristic_time = {
        'Surabaya' : 0,
        'Semarang' : 0,
        'Bandung' : 1,
        'Serang' : 0,
        'Jakarta Pusat' : 0,
        'Yogyakarta' : 0,
    }

    heuristic_cost = {
        'Surabaya' : 0,
        'Semarang' : 2,
        'Bandung' : 0,
        'Serang' : 0,
        'Jakarta Pusat' : 5,
        'Yogyakarta' : 0,
    }
    
    # Menyesuaikan nilai heuristik berdasarkan nilai kota tujuan
    start = asal
    goal = tujuan    
    if goal == 'Surabaya':
        heuristic_cost = Surabaya_heuristic_distance
        heuristic_time = Surabaya_heuristic_time
    elif goal == 'Semarang':
        heuristic_cost = Semarang_heuristic_distance
        heuristic_time = Semarang_heuristic_time
    elif goal == 'Bandung':
        heuristic_cost = Bandung_heuristic_distance
        heuristic_time = Bandung_heuristic_time
    elif goal == 'Serang':
        heuristic_cost = Serang_heuristic_distance
        heuristic_time = Serang_heuristic_time
    elif goal == 'Jakarta Pusat':
        heuristic_cost = JakartaPusat_heuristic_distance
        heuristic_time = JakartaPusat_heuristic_time
    elif goal == 'Yogyakarta':
        heuristic_cost = Jogja_heuristic_distance
        heuristic_time = Jogja_heuristic_time
    else:
        print("Invalid goal value")

    # Memanggil fungsi astar_search untuk mendapatkan hasil pencarian
    result1, final_cost1, fixed_path1 = astar_search(graph, start, goal, heuristic_cost.get, "cost_weight")
    result2,  final_cost2, fixed_path2 = astar_search(graph, start, goal, heuristic_time.get, "time_weight")

    # Mengatur respons data yang akan dikembalikan untuk pencarian berdasarkan biaya termurah
    rute1 = []
    if result1:
        print(f"A* Search dengan heuristic 1 berhasil menemukan jalur dari {start} ke {goal}")
        print("Rute dan biaya perjalanan dengan heuristic 1:")
        
        for i in range(len(fixed_path1)-1):
            current_node, current_cost, current_bus, curr_ori_coords, curr_dest_coords= fixed_path1[i]
            next_node, next_cost, next_bus, next_ori_coords, next_dest_coords = fixed_path1[i+1]
            edge_cost = (next_cost-current_cost)
            rute1.append((current_node, next_node, edge_cost, next_bus, next_ori_coords , next_dest_coords))
            print(f"{current_node} -> {next_node} : {edge_cost} : {next_bus} : Line Coords = {next_ori_coords} , {next_dest_coords} ")
        print(f"Total biaya perjalanan dengan heuristic 1: {final_cost1}")
        status1 = True
    else:
        print(f"A* Search dengan heuristic 1 tidak menemukan jalur dari {start} ke {goal}")
        status1 = False

    # Mengatur respons data yang akan dikembalikan untuk pencarian berdasarkan waktu tercepat
    rute2 = []
    if result2:
        print(f"A* Search dengan heuristic 2 berhasil menemukan jalur dari {start} ke {goal}")
        print("Rute dan waktu perjalanan dengan heuristic 2:")  
        for i in range(len(fixed_path2)-1):
            current_node, current_cost, current_bus, curr_ori_coords, curr_dest_coords = fixed_path2[i]
            next_node, next_cost, next_bus, next_ori_coords, next_dest_coords = fixed_path2[i+1]
            edge_cost = next_cost-current_cost
            rute2.append((current_node, next_node, edge_cost, next_bus, next_ori_coords , next_dest_coords ))
            print(f"{current_node} -> {next_node} : {edge_cost} : {next_bus} : Line Coords = {next_ori_coords} , {next_dest_coords} ")
        print(f"Total waktu perjalanan dengan heuristic 2: {final_cost2}")
        status2 = True
    else:
        print(f"A* Search dengan heuristic 2 tidak menemukan jalur dari {start} ke {goal}")
        status2 = False

    return_data = {"success1": status1, "success2": status2, "data_rute1": rute1, "data_rute2": rute2, "total_cost1": final_cost1, "total_cost2": final_cost2}
    return return_data
    
# Rute endpoint untuk '/option' dengan method HTTP 'GET'
@app.route('/option', methods=['GET'])

# Fungsi ini akan menghandle endpoint '/option' 
def option():
    
    # mendefinisikan nama-nama kota yang dapat dipilih beserta koordinatnya
    options = [
        { 'value': 'Jakarta Pusat', 'label': 'Jakarta Pusat', 'coordinate': { 'latitude': -6.170238459973355, 'longitude': 106.84270678401491 } },
        { 'value': 'Serang', 'label': 'Serang', 'coordinate': { 'latitude': -6.109918118031118, 'longitude': 106.1422995381122 } },
        { 'value': 'Bandung', 'label': 'Bandung', 'coordinate': { 'latitude': -6.913677130043071, 'longitude': 107.60203239958584 } },
        { 'value': 'Semarang', 'label': 'Semarang', 'coordinate': { 'latitude': -7.0291435858578195, 'longitude': 110.41763151518792 } },
        { 'value': 'Yogyakarta', 'label': 'Yogyakarta', 'coordinate': { 'latitude': -7.829349701804929, 'longitude': 110.39203413599496 } },
        { 'value': 'Surabaya', 'label': 'Surabaya', 'coordinate': { 'latitude': -7.302544723479081, 'longitude': 112.73783663618134 } },
    ]

    # Mengatur data yang akan di fetch dan meng-fetch data tersebut ke frontend    
    response = {"success": True, "options": options, "message": "Option Request processed successfully"}
    return response

# Mengaktifkan mode debug
if __name__ == "__main__":
    app.run(debug=True)