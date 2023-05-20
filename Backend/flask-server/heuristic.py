# Rute Bus
# Ini tinggal tambahin rute rute bus
# cost_weight itu weight buat a* berdasarkan harga tiket 
# time_weight itu weight buat a* berdasarkan waktu tempuh
# nilai yg udh ada disini sabi di modif suka suka rutenya
edges = [
    ('Banten', 'DKI Jakarta', {'cost_weight': 10, 'bus_name': 'bus A', 'time_weight': 1}),
    ('Banten', 'DKI Jakarta', {'cost_weight': 9, 'bus_name': 'bus B', 'time_weight': 2}),
    ('Banten', 'Jawa Barat', {'cost_weight': 22, 'bus_name': 'bus C', 'time_weight': 3}),
    ('DKI Jakarta', 'Jawa Barat', {'cost_weight': 44, 'bus_name': 'bus D', 'time_weight': 4}),
    ('Jawa Barat', 'Jawa Tengah', {'cost_weight': 29, 'bus_name': 'bus E', 'time_weight': 5}),
    ('Jawa Tengah', 'Jawa Timur', {'cost_weight': 48, 'bus_name': 'bus F', 'time_weight': 6}),
    ('Jawa Tengah', 'Jawa Timur', {'cost_weight': 60, 'bus_name': 'bus G', 'time_weight': 7}),
    ('Jawa Tengah', 'Jawa Timur', {'cost_weight': 72, 'bus_name': 'bus H', 'time_weight': 8}),
]

# Buat Heuristic nanti bakal ada sekitar 12 dictionary (6 buat heuristic time, 6 buat heuristic distance)
# Bikinnya contohnya kyk gini
# BN J WJ CJ Y EJ (buat kode banten, jakarta, central java, yogyakarta, east java)
# buat nilai heuristicnya ibunya bilang kemaren coba pake straight line distancenya(tp blm tentu fix bisa), tp kita juga bisa aja ngebuat nilai heuristicnya sendiri

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