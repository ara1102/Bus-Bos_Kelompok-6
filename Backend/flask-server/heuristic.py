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

# Serang_heuristic_distance = {
#     'Surabaya' : 800,
#     'Semarang' : 493,
#     'Bandung' : 140,
#     'Serang' : 0,
#     'Jakarta Pusat' : 60,
#     'Jogja' : 537,
# }
# Serang_heuristic_time = {
#     'Serang' : 0,
#     'Jakarta Pusat' : 70,
#     'Bandung' : 210,
#     'Semarang' : 400,
#     'Jogja' : 545,
#     'Surabaya' : 650,
# }

JakartaPusat_heuristic_distance = {
    'Serang' : 60,
    'Jakarta Pusat' : 0,
    'Bandung' : 75,
    'Semarang' : 426,
    'Jogja' : 465,
    'Surabaya' : 752,
}

JakartaPusat_heuristic_time = {
    'Serang' : 70,
    'Jakarta Pusat' : 0,
    'Bandung' : 139,
    'Semarang' : 325,
    'Jogja' : 490,
    'Surabaya' : 570,
}

Bandung_heuristic_distance = {
    'Serang' : 140,
    'Jakarta Pusat' : 75,
    'Bandung' : 0,
    'Semarang' : 345,
    'Jogja' : 390,
    'Surabaya' : 676,
}

Bandung_heuristic_time = {
    'Serang' : 210,
    'Jakarta Pusat' : 139,
    'Bandung' : 0,
    'Semarang' : 308,
    'Jogja' : 435,
    'Surabaya' : 560,
}

Semarang_heuristic_distance = {
    'Serang' : 493,
    'Jakarta Pusat' : 426,
    'Bandung' : 345,
    'Semarang' : 0,
    'Jogja' : 125,
    'Surabaya' : 324,
}

Semarang_heuristic_time = {
    'Serang' : 400,
    'Jakarta Pusat' : 325,
    'Bandung' : 308,
    'Semarang' : 0,
    'Jogja' : 159,
    'Surabaya' : 252,
}

Jogja_heuristic_distance = {
    'Serang' : 537,
    'Jakarta Pusat' : 465,
    'Bandung' : 390,
    'Semarang' : 125,
    'Jogja' : 0,
    'Surabaya' : 316,
}

Jogja_heuristic_time = {
    'Serang' : 545,
    'Jakarta Pusat' : 490,
    'Bandung' : 435,
    'Semarang' : 159,
    'Jogja' : 0,
    'Surabaya' : 287,
}

Surabaya_heuristic_distance = {
    'Serang' : 800,
    'Jakarta Pusat' : 752,
    'Bandung' : 676,
    'Semarang' : 324,
    'Jogja' : 316,
    'Surabaya' : 0,
}

Surabaya_heuristic_time = {
    'Serang' : 650,
    'Jakarta Pusat' : 570,
    'Bandung' : 560,
    'Semarang' : 252,
    'Jogja' : 287,
    'Surabaya' : 0,
}

