from flask import Flask, request, jsonify
from flask_cors import CORS
import networkx as nx
import heapq 
import requests

app = Flask(__name__)
CORS(app)

@app.route('/members', methods=['POST'])
def members():
    # get the input data
    data = request.get_json()
    origin = data.get('origin')
    destination = data.get('destination')

    # get the answer
    answer = astar(origin, destination)
    
    # process the input and return the response
    response_data = {"origin": origin, "destination": destination, "answer": answer} 
    response = {"success": True, "data": response_data, "message": "Request processed successfully"}
    return response

def astar_search(graph, start, goal, heuristic, weightType):
    visited = set()
    heap = [(heuristic(start, goal), start, 0, "")]
    steps = []
    costs = {start: 0}
    parents = {}
    while heap:
        (f, current_node, cost, name) = heapq.heappop(heap)
        if current_node in visited:
            continue
        visited.add(current_node)
        steps.append((current_node, cost, name))
        if current_node == goal:
            fixed_path = []
            node = goal
            while node != start:
                fixed_path.append((node, costs[node], parents[node][2], parents[node][3], parents[node][4]))
                node = parents[node][0]
            fixed_path.append((start, 0, "", [0,0], [0,0]))
            fixed_path.reverse()
            return True, steps, costs[goal], fixed_path
        for neighbor in graph.neighbors(current_node):
            if neighbor not in visited:
                for edge in graph[current_node][neighbor].values():
                    new_cost = edge[weightType] + cost
                    bus_name = edge.get('bus_name')
                    neighbor_ori_coords =  edge.get('origin_coords')
                    neighbor_dest_coords =  edge.get('dest_coords')
                    if neighbor not in costs or new_cost < costs[neighbor]:
                        costs[neighbor] = new_cost
                        parents[neighbor] = (current_node, new_cost, bus_name, neighbor_ori_coords, neighbor_dest_coords)  # Update the parent node, cost, and bus name
                        heapq.heappush(heap, (new_cost + heuristic(neighbor, goal), neighbor, new_cost, bus_name))
    return False, steps, None, None

def astar(asal, tujuan):

    graph = nx.MultiGraph()

    # Rute Bus
    # Ini tinggal tambahin rute rute bus
    # cost_weight itu weight buat a* berdasarkan harga tiket 
    # time_weight itu weight buat a* berdasarkan waktu tempuh


    edges = [
        ('Serang', 'Jakarta Pusat', {'cost_weight': 83, 'bus_name': 'bus Andara', 'time_weight': 78, 'origin_coords': (-6.109918118031118,106.1422995381122), 'dest_coords': ( -6.170238459973355, 106.84270678401491)}),
        ('Serang', 'Jakarta Pusat', {'cost_weight': 74, 'bus_name': 'bus Endhog', 'time_weight': 85, 'origin_coords': (-6.109918118031118,106.1422995381122), 'dest_coords': ( -6.170238459973355, 106.84270678401491)}),
        ('Serang', 'Jakarta Pusat', {'cost_weight': 65, 'bus_name': 'bus Mamanur', 'time_weight': 88, 'origin_coords': (-6.109918118031118,106.1422995381122), 'dest_coords': ( -6.170238459973355, 106.84270678401491)}),

        ('Jakarta Pusat', 'Bandung', {'cost_weight': 80, 'bus_name': 'bus Endhog', 'time_weight': 145, 'origin_coords': ( -6.170238459973355, 106.84270678401491), 'dest_coords': (-6.913677130043071, 107.60203239958584)}),
        ('Jakarta Pusat', 'Bandung', {'cost_weight': 89, 'bus_name': 'bus Mamanur', 'time_weight': 152, 'origin_coords': ( -6.170238459973355, 106.84270678401491), 'dest_coords': (-6.913677130043071, 107.60203239958584)}),

        ('Bandung', 'Semarang', {'cost_weight': 370, 'bus_name': 'bus Busbew', 'time_weight': 313, 'origin_coords': (-6.913677130043071, 107.60203239958584), 'dest_coords': (-7.0291435858578195, 110.41763151518792)}),
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

    # Buat Heuristic nanti bakal ada sekitar 12 dictionary (6 buat heuristic time, 6 buat heuristic distance)
    # Bikinnya contohnya kyk gini
    # BN J WJ CJ Y EJ (buat kode banten, jakarta, central java, yogyakarta, east java)

    # BN_heuristic_time = {
    #     'Jawa Timur' : 0,
    #     'Jawa Tengah' : 0,
    #     'Jawa Barat' : 0,
    #     'Banten' : 0,
    #     'DKI Jakarta' : 0,
    #     'Yogyakarta' : 0,
    # }
    # BN_heuristic_distance = {
    #     'Jawa Timur' : 0,
    #     'Jawa Tengah' : 0,
    #     'Jawa Barat' : 0,
    #     'Banten' : 0,
    #     'DKI Jakarta' : 0,
    #     'Yogyakarta' : 0,
    # }

    heuristic_time = {
        'Surabaya' : 0,
        'Semarang' : 0,
        'Bandung' : 0,
        'Serang' : 0,
        'Jakarta Pusat' : 0,
        'Yogyakarta' : 0,
    }

    heuristic_cost = {
        'Surabaya' : 0,
        'Semarang' : 0,
        'Bandung' : 0,
        'Serang' : 0,
        'Jakarta Pusat' : 0,
        'Yogyakarta' : 0,
    }

    start = asal
    goal = tujuan
    result1, steps1, final_cost1, fixed_path1 = astar_search(graph, start, goal, heuristic_cost.get, "cost_weight")
    result2, steps2, final_cost2, fixed_path2 = astar_search(graph, start, goal, heuristic_time.get, "time_weight")
    rute1 = []
    if result1:
        print(f"A* Search dengan heuristic 1 berhasil menemukan jalur dari {start} ke {goal}")
        print("Rute dan biaya perjalanan dengan heuristic 1:")
        
        for i in range(len(fixed_path1)-1):
            current_node, current_cost, current_bus, curr_ori_coords, curr_dest_coords= fixed_path1[i]
            next_node, next_cost, next_bus, next_ori_coords, next_dest_coords = fixed_path1[i+1]
            edge_cost = next_cost-current_cost
            rute1.append((current_node, next_node, edge_cost, next_bus, next_ori_coords , next_dest_coords))
            print(f"{current_node} -> {next_node} : {edge_cost} : {next_bus} : Line Coords = {next_ori_coords} , {next_dest_coords} ")
        print(f"Total biaya perjalanan dengan heuristic 1: {final_cost1}")
        status1 = True
    else:
        print(f"A* Search dengan heuristic 1 tidak menemukan jalur dari {start} ke {goal}")
        status1 = False

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
    
@app.route('/option', methods=['GET'])
def option():
    
    options = [
        { 'value': 'Jakarta Pusat', 'label': 'Jakarta Pusat', 'coordinate': { 'latitude': -6.170238459973355, 'longitude': 106.84270678401491 } },
        { 'value': 'Serang', 'label': 'Serang', 'coordinate': { 'latitude': -6.109918118031118, 'longitude': 106.1422995381122 } },
        { 'value': 'Bandung', 'label': 'Bandung', 'coordinate': { 'latitude': -6.913677130043071, 'longitude': 107.60203239958584 } },
        { 'value': 'Semarang', 'label': 'Semarang', 'coordinate': { 'latitude': -7.0291435858578195, 'longitude': 110.41763151518792 } },
        { 'value': 'Yogyakarta', 'label': 'Yogyakarta', 'coordinate': { 'latitude': -7.829349701804929, 'longitude': 110.39203413599496 } },
        { 'value': 'Surabaya', 'label': 'Surabaya', 'coordinate': { 'latitude': -7.302544723479081, 'longitude': 112.73783663618134 } },
    ]

    response = {"success": True, "options": options, "message": "Option Request processed successfully"}
    return response

# NAMA BUS BISA
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import networkx as nx
# import heapq 
# import requests

# app = Flask(__name__)
# CORS(app)

# @app.route('/members', methods=['POST'])
# def members():
#     # get the input data
#     data = request.get_json()
#     origin = data.get('origin')
#     destination = data.get('destination')

#     # get the answer
#     answer = astar(origin, destination)
    
#     # process the input and return the response
#     response_data = {"origin": origin, "destination": destination, "answer": answer} 
#     response = {"success": True, "data": response_data, "message": "Request processed successfully"}
#     return response

# find fized path
# def astar_search(graph, start, goal, heuristic, weightType):
#     visited = set()
#     heap = [(heuristic(start, goal), start, 0, "")]
#     steps = []
#     costs = {start: 0}
#     while heap:
#         (f, current_node, cost, name) = heapq.heappop(heap)
#         if current_node in visited:
#             continue
#         visited.add(current_node)
#         steps.append((current_node, cost, name))
#         if current_node == goal:
#             # Retrieve the fixed path
#             fixed_path = [steps[-1]]
#             parent_node = steps[-1][0]
#             while parent_node != start:
#                 for step in reversed(steps[:-1]):
#                     if step[0] == parent_node and step[2] == fixed_path[-1][2]:
#                         fixed_path.append(step)
#                         parent_node = step[0]
#                         break
#             fixed_path.reverse()
#             return True, fixed_path, costs[goal]
#         for neighbor in graph.neighbors(current_node):
#             if neighbor not in visited:
#                 for edge in graph[current_node][neighbor].values():
#                     new_cost = edge[weightType] + cost  # Use the specified weight
#                     bus_name = edge.get('bus_name')
#                     if neighbor not in costs or new_cost < costs[neighbor]:
#                         costs[neighbor] = new_cost
#                         heapq.heappush(heap, (new_cost + heuristic(neighbor, goal), neighbor, new_cost, bus_name))
#     return False, steps, None

# def astar_search(graph, start, goal, heuristic, weightType):
#     visited = set()
#     heap = [(heuristic(start, goal), start, 0, "")]
#     steps = []
#     costs = {start: 0}
#     parents = {}  # Keep track of the parent node for each visited node
#     while heap:
#         (f, current_node, cost, name) = heapq.heappop(heap)
#         if current_node in visited:
#             continue
#         visited.add(current_node)
#         steps.append((current_node, cost, name))
#         if current_node == goal:
#             # Extract the fixed path from the parents dictionary
#             fixed_path = []
#             node = goal
#             while node != start:
#                 fixed_path.append(node)
#                 node = parents[node]
#             fixed_path.append(start)
#             fixed_path.reverse()
#             return True, steps, costs[goal], fixed_path
#         for neighbor in graph.neighbors(current_node):
#             if neighbor not in visited:
#                 for edge in graph[current_node][neighbor].values():
#                     new_cost = edge[weightType] + cost  # Use the specified weight
#                     bus_name = edge.get('bus_name')
#                     if neighbor not in costs or new_cost < costs[neighbor]:
#                         costs[neighbor] = new_cost
#                         parents[neighbor] = current_node  # Update the parent node
#                         heapq.heappush(heap, (new_cost + heuristic(neighbor, goal), neighbor, new_cost, bus_name))
#     return False, steps, None, None

# bus name still wrong
# def astar_search(graph, start, goal, heuristic, weightType):
#     visited = set()
#     heap = [(heuristic(start, goal), start, 0, "")]
#     steps = []
#     costs = {start: 0}
#     parents = {}  # Keep track of the parent node for each visited node
#     while heap:
#         (f, current_node, cost, name) = heapq.heappop(heap)
#         if current_node in visited:
#             continue
#         visited.add(current_node)
#         steps.append((current_node, cost, name))
#         if current_node == goal:
#             # Extract the fixed path from the parents dictionary
#             fixed_path = []
#             node = goal
#             while node != start:
#                 fixed_path.append((node, costs[node], graph[parents[node]][node][0].get('bus_name', "")))
#                 node = parents[node]
#             fixed_path.append((start, costs[start], ""))  # Add start node without bus name
#             fixed_path.reverse()
#             return True, steps, costs[goal], fixed_path
#         for neighbor in graph.neighbors(current_node):
#             if neighbor not in visited:
#                 for edge in graph[current_node][neighbor].values():
#                     new_cost = edge[weightType] + cost  # Use the specified weight
#                     bus_name = edge.get('bus_name', "")  # Assign bus_name from the current edge
#                     if neighbor not in costs or new_cost < costs[neighbor]:
#                         costs[neighbor] = new_cost
#                         parents[neighbor] = current_node  # Update the parent node
#                         heapq.heappush(heap, (new_cost + heuristic(neighbor, goal), neighbor, new_cost, bus_name))
#     return False, steps, None, None



# original
# def astar_search(graph, start, goal, heuristic, weightType):
#     visited = set()
#     heap = [(heuristic(start, goal), start, 0, "")]
#     steps = []
#     costs = {start: 0}
#     while heap:
#         (f, current_node, cost, name) = heapq.heappop(heap)
#         if current_node in visited:
#             continue
#         visited.add(current_node)
#         steps.append((current_node, cost, name))
#         if current_node == goal:
#             return True, steps, costs[goal]
#         for neighbor in graph.neighbors(current_node):
#             if neighbor not in visited:
#                 for edge in graph[current_node][neighbor].values():
#                     new_cost = edge[weightType] + cost  # Use the specified weight
#                     bus_name = edge.get('bus_name')
#                     if neighbor not in costs or new_cost < costs[neighbor]:
#                         costs[neighbor] = new_cost
#                         heapq.heappush(heap, (new_cost + heuristic(neighbor, goal), neighbor, new_cost, bus_name))
#     return False, steps, None


#added cords
# def astar_search(graph, start, goal, heuristic, weightType):
#     visited = set()
#     heap = [(heuristic(start, goal), start, 0, "", 0, 0)]
#     steps = []
#     costs = {start: 0}
#     while heap:
#         (f, current_node, cost, name, ori_coords, dest_coords) = heapq.heappop(heap)
#         if current_node in visited:
#             continue
#         visited.add(current_node)
#         steps.append((current_node, cost, name, ori_coords, dest_coords))
#         if current_node == goal:
#             return True, steps, costs[goal]
#         for neighbor in graph.neighbors(current_node):
#             if neighbor not in visited:
#                 for edge in graph[current_node][neighbor].values():
#                     new_cost = edge[weightType] + cost  # Use the specified weight
#                     bus_name = edge.get('bus_name')
#                     neighbor_ori_coords =  edge.get('origin_coords')
#                     neighbor_dest_coords =  edge.get('dest_coords')
#                     if neighbor not in costs or new_cost < costs[neighbor]:
#                         costs[neighbor] = new_cost
#                         heapq.heappush(heap, (new_cost + heuristic(neighbor, goal), neighbor, new_cost, bus_name, neighbor_ori_coords, neighbor_dest_coords))
#     return False, steps, None

# modified fixed steps
# def astar_search(graph, start, goal, heuristic, weightType):
#     visited = set()
#     heap = [(heuristic(start, goal), start, 0, "", 0, 0)]
#     steps = []
#     costs = {start: 0}
#     while heap:
#         (f, current_node, cost, name, ori_coords, dest_coords) = heapq.heappop(heap)
#         if current_node in visited:
#             continue
#         visited.add(current_node)
#         if current_node == goal:
#             steps.append((current_node, cost, name, ori_coords, dest_coords))
#             return True, steps, costs[goal]
#         for neighbor in graph.neighbors(current_node):
#             if neighbor not in visited:
#                 for edge in graph[current_node][neighbor].values():
#                     new_cost = edge[weightType] + cost  # Use the specified weight
#                     bus_name = edge.get('bus_name')
#                     neighbor_ori_coords = edge.get('origin_coords')
#                     neighbor_dest_coords = edge.get('dest_coords')
#                     if neighbor not in costs or new_cost < costs[neighbor]:
#                         costs[neighbor] = new_cost
#                         heapq.heappush(heap, (new_cost + heuristic(neighbor, goal), neighbor, new_cost, bus_name, neighbor_ori_coords, neighbor_dest_coords))
#                         steps.append((neighbor, new_cost, bus_name, neighbor_ori_coords, neighbor_dest_coords))
#     return False, steps, None

# def astar_search(graph, start, goal, heuristic):
#     visited = set()
#     heap = [(heuristic(start, goal), start, 0, "")]
#     steps = []
#     costs = {start: 0}
#     while heap:
#         (f, current_node, cost, name) = heapq.heappop(heap)
#         if current_node in visited:
#             continue
#         visited.add(current_node)
#         steps.append((current_node, cost, name))
#         if current_node == goal:
#             return True, steps, costs[goal]
#         for neighbor in graph.neighbors(current_node):
#             if neighbor not in visited:
#                 for edge in graph[current_node][neighbor].values():
#                     new_cost = edge['weight'] + cost
#                     bus_name = edge.get('bus_name')
#                     if neighbor not in costs or new_cost < costs[neighbor]:
#                         costs[neighbor] = new_cost
#                         heapq.heappush(heap, (new_cost + heuristic(neighbor, goal), neighbor, new_cost, bus_name))
#     return False, steps, None


# def astar(asal, tujuan):

#     graph = nx.MultiGraph()

#     # Rute Bus
#     edges = [
#         ('Banten', 'DKI Jakarta', {'weight': 10, 'bus_name': 'bus A'}),
#         ('Banten', 'DKI Jakarta', {'weight': 9, 'bus_name': 'bus B'}),
#         ('Banten', 'Jawa Barat', {'weight': 22, 'bus_name': 'bus C'}),
#         ('DKI Jakarta', 'Jawa Barat', {'weight': 44, 'bus_name': 'bus D'}),
#         ('Jawa Barat', 'Jawa Tengah', {'weight': 29, 'bus_name': 'bus E'}),
#         ('Jawa Tengah', 'Jawa Timur', {'weight': 48, 'bus_name': 'bus F'}),
#         ('Jawa Tengah', 'Jawa Timur', {'weight': 60, 'bus_name': 'bus G'}),
#         ('Jawa Tengah', 'Jawa Timur', {'weight': 72, 'bus_name': 'bus H'}),
#     ]
#     graph.add_edges_from([(u, v, d) for (u, v, d) in edges])

#     # Definisikan heuristic
#     heuristic = {
#         'Jawa Timur' : 0,
#         'Jawa Tengah' : 0,
#         'Jawa Barat' : 0,
#         'Banten' : 0,
#         'DKI Jakarta' : 0,
#         'Yogyakarta' : 0,
#     }

#     start = asal
#     goal = tujuan
#     result, steps, final_cost = astar_search(graph, start, goal, heuristic.get)
#     print(steps)
#     if result:
#         print(f"A* Search berhasil menemukan jalur dari {start} ke {goal}")
#         print("Rute dan biaya perjalanan:")
#         rute = []
#         for i in range(len(steps)-1):
#             current_node, current_cost, current_bus = steps[i]
#             next_node, next_cost, next_bus = steps[i+1]
#             edge_cost = next_cost-current_cost
#             rute.append((current_node, next_node, edge_cost, next_bus))
#             print(f"{current_node} -> {next_node} : {edge_cost} : {next_bus}")
#         print(f"Total biaya perjalanan: {final_cost}")
#         return_data = {"status": "success", "data_rute": rute, "total_cost": final_cost}
#     else:
#         print(f"A* Search tidak menemukan jalur dari {start} ke {goal}")
#         return_data = {"status": "failed", "data_rute": [], "total_cost": None}

#     return return_data

# @app.route('/get_cities')
# def get_cities():
#     # return response
#     API_KEY = "WOgGydkxmMgaen6wImQKXLEgZFyMGk"
#     url = f"https://api.goapi.id/v1/regional/kota?provinsi_id=35&api_key={API_KEY}"
#     headers = {"Content-Type": "application/json"}

#     response = requests.get(url, headers=headers)
#     print(response.json())
#     return response.json()


if __name__ == "__main__":
    app.run(debug=True)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import networkx as nx
# import heapq 
# import requests

# app = Flask(__name__)
# CORS(app)

# @app.route('/members', methods=['POST'])
# def members():
#     # get the input data
#     data = request.get_json()
#     origin = data.get('origin')
#     destination = data.get('destination')

#     # get the answer
#     answer = astar(origin, destination)
    
#     # process the input and return the response
#     response_data = {"origin": origin, "destination": destination, "answer": answer} 
#     response = {"success": True, "data": response_data, "message": "Request processed successfully"}
#     return response

# # astar func example
# def astar_search(graph, start, goal, heuristic):
#     visited = set()
#     heap = [(heuristic(start, goal), start, 0)]
#     steps = []
#     costs = {start: 0}
#     while heap:
#         (f, current_node, cost) = heapq.heappop(heap)
#         if current_node in visited:
#             continue
#         visited.add(current_node)
#         steps.append((current_node, cost))
#         if current_node == goal:
#             return True, steps, costs[goal]
#         for neighbor in graph.neighbors(current_node):
#             if neighbor not in visited:
#                 for edge in graph[current_node][neighbor].values():
#                     new_cost = edge['weight'] + cost
#                     if neighbor not in costs or new_cost < costs[neighbor]:
#                         costs[neighbor] = new_cost
#                         heapq.heappush(heap, (new_cost + heuristic(neighbor, goal), neighbor, new_cost))
#     return False, steps, None

# def astar(asal, tujuan):

#     graph = nx.MultiGraph()
    
#     # Rute Bus
#     edges = [
#     ('Banten', 'DKI Jakarta', 10),
#     ('Banten', 'DKI Jakarta', 9),
#     ('Banten', 'Jawa Barat', 22),
#     ('DKI Jakarta', 'Jawa Barat', 44),
#     ('Jawa Barat', 'Jawa Tengah', 29),
#     ('Jawa Tengah', 'Jawa Timur', 48),
#     ('Jawa Tengah', 'Jawa Timur', 60),
#     ('Jawa Tengah', 'Jawa Timur', 72),
#     ]
#     graph.add_weighted_edges_from([(u, v, d) for (u, v, d) in edges])

#     # Definisikan heuristic
#     heuristic = {
#         'Jawa Timur' : 0,
#         'Jawa Tengah' : 0,
#         'Jawa Barat' : 0,
#         'Banten' : 0,
#         'DKI Jakarta' : 0,
#         'Yogyakarta' : 0,
#     }

#     start = asal
#     goal = tujuan
#     result, steps, final_cost = astar_search(graph, start, goal, heuristic.get)
#     if result:
#         print(f"A* Search berhasil menemukan jalur dari {start} ke {goal}")
#         print("Rute dan biaya perjalanan:")
#         rute = []
#         for i in range(len(steps)-1):
#             current_node, current_cost = steps[i]
#             next_node, next_cost = steps[i+1]
#             edge_cost = next_cost-current_cost
#             rute.append((current_node, next_node, edge_cost))
#             print(f"{current_node} -> {next_node} : {edge_cost}")
#         print(f"Total biaya perjalanan: {final_cost}")
#         return_data = {"status": "success", "data_rute": rute, "total_cost": final_cost}
#     else:
#         print(f"A* Search tidak menemukan jalur dari {start} ke {goal}")
#         return_data = {"status": "failed", "data_rute": [], "total_cost": None}

#     return return_data

# # @app.route('/get_cities')
# # def get_cities():
# #     # return response
# #     API_KEY = "WOgGydkxmMgaen6wImQKXLEgZFyMGk"
# #     url = f"https://api.goapi.id/v1/regional/kota?provinsi_id=35&api_key={API_KEY}"
# #     headers = {"Content-Type": "application/json"}

# #     response = requests.get(url, headers=headers)
# #     print(response.json())
# #     return response.json()


# if __name__ == "__main__":
#     app.run(debug=True)

