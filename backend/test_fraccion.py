import requests

casos = [
    {"numerador": "1", "denominador": "11", "base": 2},
    {"numerador": "5", "denominador": "2",  "base": 10},
    {"numerador": "1", "denominador": "6",  "base": 10},
    {"numerador": "A", "denominador": "F",  "base": 16},
]

for c in casos:
    r = requests.post("http://localhost:8000/fraccion-a-nmal", json=c)
    d = r.json()
    print(
        "{}/{} base {} => {} | periodico={}".format(
            c["numerador"], c["denominador"], c["base"],
            d["resultado_completo"], d["es_periodico"]
        )
    )
